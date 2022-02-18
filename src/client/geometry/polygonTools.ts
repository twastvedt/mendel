import { BBox, Position } from "@/entity/geoJson";
import { Vector } from "../Vector";

const tempVec1 = new Vector(0, 0);
const tempVec2 = new Vector(0, 0);

const epsilon = 0.0001;

/**
 * Find the signed distance to the closest point on a polygon. Positive distances are inside the polygon.
 * @param polygon
 * @param point
 * @param getClosest Output the indeces of all edges closer than this threshold.
 * @param segmentsToCheck Only check these polygon segments for closest edge.
 * @returns
 */
export function distanceToPolygon(
  polygon: Position[],
  point: Position,
  getClosest?: number,
  segmentsToCheck?: number[]
): { distance: number; closest: number[]; point: Vector } {
  const p = new Vector(...point);

  const segmentEnd = new Vector(...polygon[0]);
  const segmentStart = new Vector(...polygon[0]);

  const x = point[0];
  const y = point[1];
  let x1;
  let y1;
  let inside = false;
  const closest = [] as number[];
  let lastCheckedSegment = 0;
  const closestPoint = new Vector(0, 0);

  const distance = polygon.reduce((minD, vertex, n) => {
    if (n === 0) {
      return minD;
    }

    segmentStart.copy(segmentEnd);
    segmentEnd.set(...vertex);

    x1 = vertex[0];
    y1 = vertex[1];

    if (
      y1 > y !== segmentStart.y > y &&
      x < ((segmentStart.x - x1) * (y - y1)) / (segmentStart.y - y1) + x1
    ) {
      inside = !inside;
    }

    if (segmentsToCheck?.length) {
      // Don't calculate distance if this isn't one of the segments to check.
      const foundIndex = segmentsToCheck.indexOf(n - 1, lastCheckedSegment);

      if (foundIndex !== -1) {
        lastCheckedSegment = foundIndex + 1;
      } else {
        return minD;
      }
    }

    // https://stackoverflow.com/a/1501725/890132
    // TODO: Cache polygon segment lengths
    Vector.subtract(p, segmentStart, tempVec1);
    Vector.subtract(segmentEnd, segmentStart, tempVec2);

    const segmentLengthSquared = tempVec2.length ** 2;

    if (segmentLengthSquared == 0) {
      return minD;
    }

    const param = tempVec1.dot(tempVec2) / segmentLengthSquared;

    if (param < 0) {
      tempVec1.copy(segmentStart);
    } else if (param > 1) {
      tempVec1.copy(segmentEnd);
    } else {
      Vector.add(segmentStart, tempVec2.scale(param), tempVec1);
    }

    const d = p.distanceTo(tempVec1);

    if (getClosest && d <= getClosest) {
      closest.push(n - 1);
    }

    if (minD == undefined || d < minD) {
      closestPoint.copy(tempVec1);
      return d;
    }

    return minD;
  }, undefined as number | undefined);

  if (distance === undefined) {
    throw new Error("Empty polygon?");
  }

  return {
    distance: distance * (inside ? 1 : -1),
    closest,
    point: closestPoint,
  };
}

export function polygonBounds(polygon: Position[], padding = 0): BBox {
  return polygon.reduce(
    (box, point) => {
      if (point[0] - padding < box[0]) {
        box[0] = point[0] - padding;
      } else if (point[0] + padding > box[2]) {
        box[2] = point[0] + padding;
      }

      if (point[1] - padding < box[1]) {
        box[1] = point[1] - padding;
      } else if (point[1] + padding > box[3]) {
        box[3] = point[1] + padding;
      }

      return box;
    },
    [...polygon[0], ...polygon[1]]
  );
}

export function pointInBounds(
  point: Position,
  bounds: BBox,
  padding = 0
): boolean {
  return (
    bounds[0] - padding <= point[0] &&
    bounds[1] - padding <= point[1] &&
    bounds[2] + padding >= point[0] &&
    bounds[3] - padding >= point[1]
  );
}

export function splitPolygon(
  polygon: Position[],
  line: Position[]
): [Position[], Position[]] {
  const start = distanceToPolygon(polygon, line[0], epsilon);
  let startIndex = start.closest[0];
  const end = distanceToPolygon(polygon, line[line.length - 1], epsilon);
  let endIndex = end.closest[0];

  const privateLine = [...line];

  if (Math.abs(start.distance) > epsilon || Math.abs(end.distance) > epsilon) {
    throw new Error("line endpoints not on polygon.");
  }

  if (startIndex > endIndex) {
    privateLine.reverse();
    [startIndex, endIndex] = [endIndex, startIndex];
  }

  const polygon1 = [
    privateLine[0],
    ...polygon.slice(startIndex + 1, endIndex),
    ...privateLine.slice().reverse(),
  ];

  const polygon2 = [
    ...privateLine,
    ...polygon.slice(endIndex + 1),
    ...polygon.slice(0, startIndex),
    privateLine[0],
  ];

  return [polygon1, polygon2];
}

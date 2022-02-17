import { Garden } from "@/entity/Garden";
import { BBox, Position } from "@/entity/geoJson";
import { Hex } from "../hexGrid/Hex";
import { HexGrid } from "../hexGrid/HexGrid";
import { Vector } from "../Vector";

export interface GridPoints {
  interiorPoints: Position[];
  offset: Position;
  edgePoints: { point: Position; edges: number[]; display: boolean }[];
}

const halfRoot3 = Math.sqrt(3) / 2;
const root3 = Math.sqrt(3);

const tempVec1 = new Vector(0, 0);
const tempVec2 = new Vector(0, 0);

export class PolygonGrid {
  public grids: GridPoints[] = [];

  private _diameter!: number;

  public hexGrid: HexGrid;

  public get diameter(): number {
    return this._diameter;
  }

  public set diameter(value: number) {
    if (!value) {
      throw new Error("Diameter must be greater than 0.");
    }

    this._diameter = value;

    this.hexGrid.size = value / root3;

    this.grids = this.garden.beds.map((b) =>
      this.makeGrid(b.shape.coordinates[0])
    );
  }

  constructor(private garden: Garden, diameter: number) {
    this.hexGrid = new HexGrid(0, new Vector(0, 0), diameter / root3);

    this.diameter = diameter;
  }

  /**
   *
   * @param point Cursor location, in database coordinates.
   * @param bedIndex Current bed, found from SVG pointer events.
   */
  setCursor(point: Position, bedIndex: number): void {
    const grid = this.grids[bedIndex];

    const nearestHex = this.hexGrid.convertFrom(
      this.hexGrid.convertTo(point, true)
    );

    const offset = grid.offset;

    offset[0] = point[0] - nearestHex.x;
    offset[1] = point[1] - nearestHex.y;

    if (!offset[0] && !offset[1]) {
      return;
    }

    grid.edgePoints.forEach((p) => {
      const result = PolygonGrid.distanceToPolygon(
        this.garden.beds[bedIndex].shape.coordinates[0],
        [p.point[0] + offset[0], p.point[1] + offset[1]],
        undefined,
        p.edges
      );

      p.display = result.distance >= 0;
    });
  }

  makeGrid(polygon: Position[]): GridPoints {
    const grid: GridPoints = {
      interiorPoints: [],
      edgePoints: [],
      offset: [0, 0],
    };

    const bounds = this.polygonBounds(polygon, this._diameter / root3);

    const corners = (
      [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[1]],
        [bounds[2], bounds[3]],
      ] as Position[]
    ).map((c) => this.hexGrid.convertTo(c, true));

    const line1 = corners[0].lineTo(corners[1]);
    const line2 = corners[1].lineTo(corners[2]);

    let lastHexRow = [] as (Hex | undefined)[];

    for (const hex2 of line2) {
      const offset = hex2.subtract(line2[0]);

      lastHexRow = line1.map((hex1, i) => {
        const newHex = hex1.add(offset);

        if (
          newHex.equals(lastHexRow[i - 1]) ||
          newHex.equals(lastHexRow[i + 1])
        ) {
          return undefined;
        }

        const point = this.hexGrid.convertFrom(newHex).asArray;

        const { distance, closest } = PolygonGrid.distanceToPolygon(
          polygon,
          point,
          this.hexGrid.size
        );

        if (distance > this._diameter) {
          grid.interiorPoints.push(point);
        } else if (distance > -this._diameter) {
          grid.edgePoints.push({
            point,
            edges: closest,
            display: distance > 0,
          });
        }

        return newHex;
      });
    }

    return grid;
  }

  /**
   * Find the signed distance to the closest point on a polygon. Positive distances are inside the polygon.
   * @param polygon
   * @param point
   * @param getClosest Output the indeces of all edges closer than this threshold.
   * @param segmentsToCheck Only check these polygon segments for closest edge.
   * @returns
   */
  static distanceToPolygon(
    polygon: Position[],
    point: Position,
    getClosest?: number,
    segmentsToCheck?: number[]
  ): { distance: number; closest: number[] } {
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

      const l2 = tempVec2.length ** 2;

      if (l2 == 0) {
        return minD;
      }

      const param = tempVec1.dot(tempVec2) / l2;

      let d;

      if (param < 0) {
        d = p.distanceTo(segmentStart);
      } else if (param > 1) {
        d = p.distanceTo(segmentEnd);
      } else {
        d = p.distanceTo(tempVec2.scale(param).add(segmentStart));
      }

      if (getClosest && d <= getClosest) {
        closest.push(n - 1);
      }

      if (minD == undefined || d < minD) {
        return d;
      }

      return minD;
    }, undefined as number | undefined);

    if (distance === undefined) {
      throw new Error("Empty polygon?");
    }

    return { distance: distance * (inside ? 1 : -1), closest };
  }

  polygonBounds(polygon: Position[], padding = 0): BBox {
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
}

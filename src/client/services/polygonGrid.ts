import { Garden } from "@/entity/Garden";
import { BBox, Position } from "@/entity/geoJson";
import { polygonContains } from "d3-polygon";
import { Vector } from "../Vector";

interface GridPoints {
  interiorPoints: Position[];
  edgePoints: Position[];
}

const equilateralTriangleHeight = Math.sqrt(3) / 2;

export class PolygonGrid {
  private paddedBounds: BBox[] = [];

  private grids: GridPoints[] = [];

  private _diameter = 6;

  public get diameter(): number {
    return this._diameter;
  }

  public set diameter(value: number) {
    if (!value) {
      throw new Error("Diameter must be greater than 0.");
    }

    this.grids = [];

    this.paddedBounds = this.garden.beds.map((b) =>
      this.polygonBounds(b.shape.coordinates[0], value)
    );

    this._diameter = value;
  }

  constructor(private garden: Garden) {}

  /**
   *
   * @param point Cursor location, in database coordinates.
   * @param bedIndex Current bed, found from SVG pointer events.
   */
  setCursor(point: Position, bedIndex: number): void {
    const grid = this.grids[bedIndex];

    if (!grid) {
      this.makeGrid(point, bedIndex);

      return;
    }

    const gridPoint = grid.interiorPoints[0] ?? grid.edgePoints[0];

    //...
  }

  makeGrid(origin: Position, bedIndex: number): GridPoints {
    const grid: GridPoints = { interiorPoints: [], edgePoints: [] };

    const coordinates = new Set<Position>([[0, 0]]);

    const bounds = this.paddedBounds[bedIndex];

    const bed = this.garden.beds[bedIndex].shape.coordinates[0];

    for (const coordinate of coordinates) {
      const point = this.relativeGridPoint(origin, ...coordinate);

      if (
        point[0] <= bounds[0] ||
        point[0] >= bounds[2] ||
        point[1] <= bounds[1] ||
        point[1] >= bounds[3]
      ) {
        continue;
      }

      const distance = this.distanceToPolygon(bed, point);

      if (distance >= this._diameter) {
        grid.interiorPoints.push(point);
      } else if (distance > -this._diameter) {
        grid.edgePoints.push(point);
      }

      // Add adjacent points to the todo list, if they aren't already there.
      coordinates.add([coordinate[0], coordinate[1] + 1]);
      coordinates.add([coordinate[0] + 1, coordinate[1]]);
      coordinates.add([coordinate[0] - 1, coordinate[1]]);
      coordinates.add([coordinate[0], coordinate[1] - 1]);
      // Skewed grid, so only two of the corners are adjacent in the hexagonal pattern.
      coordinates.add([coordinate[0] - 1, coordinate[1] + 1]);
      coordinates.add([coordinate[0] + 1, coordinate[1] - 1]);
    }

    this.grids[bedIndex] = grid;

    return grid;
  }

  distanceToPolygon(polygon: Position[], point: Position): number {
    let distance = undefined as number | undefined;

    let segmentStart: Position;

    polygon.forEach((segmentEnd, n) => {
      segmentStart = n == 0 ? polygon[polygon.length - 1] : polygon[n - 1];

      // https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
      // TODO: Cache polygon segment lengths
      const d =
        ((segmentEnd[0] - segmentStart[0]) * (segmentStart[1] - point[1]) -
          (segmentStart[0] - point[0]) * (segmentEnd[1] - segmentStart[0])) /
        Math.sqrt(
          (segmentEnd[0] - segmentStart[0]) ** 2 +
            (segmentEnd[1] - segmentStart[1]) ** 2
        );

      if (!distance || Math.abs(d) < Math.abs(distance)) {
        distance = d;
      }
    });

    if (!distance) {
      throw new Error("Empty polygon?");
    }

    return distance;
  }

  /**
   * Find a point in the skewed circle grid.
   * @param origin
   * @param x
   * @param y
   */
  relativeGridPoint(origin: Position, x: number, y: number): Position {
    return [
      origin[0] + this._diameter * x + (this._diameter / 2) * y,
      origin[1] + this._diameter * y * equilateralTriangleHeight,
    ];
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

import type { BBox, Position } from "@mendel/common";
import {
  distanceToPolygon,
  pointInBounds,
  polygonBounds,
  splitPolygon,
} from "../geometry/polygonTools";
import type { Hex } from "../hexGrid/Hex";
import { HexGrid } from "../hexGrid/HexGrid";
import { Vector } from "../Vector";

export interface GridPoints {
  interiorPoints: Position[];
  offset: Position;
  edgePoints: { point: Position; edges: number[]; display: boolean }[];
}

export interface Area {
  polygon: Position[];
  parent?: Area;
  siblings: Area[];
}

const root3 = Math.sqrt(3);

export class PolygonGrid {
  public grids: GridPoints[] = [];

  public areas: Area[];

  private _diameter!: number;

  public hexGrid: HexGrid;

  public bounds: BBox[];

  /**
   * Grid cursor is currently over. Used when updating rotation, so only that grid is recalculated.
   */
  public activeGrid = 0;

  public get diameter(): number {
    return this._diameter;
  }

  public set diameter(value: number) {
    if (!value) {
      throw new Error("Diameter must be greater than 0.");
    }

    this._diameter = value;

    this.hexGrid.size = value / root3;

    this.areas.forEach((p, i) => this.updateGrid(i));
  }

  public get rotation(): number {
    return this.hexGrid.angle;
  }

  public set rotation(radians: number) {
    this.hexGrid.angle = radians;

    this.updateGrid(this.activeGrid);
  }

  constructor(polygons: Position[][], diameter: number) {
    this.areas = polygons.map((polygon) => ({ polygon, siblings: [] }));

    this.hexGrid = new HexGrid(0, new Vector(0, 0), diameter / root3);

    this.bounds = polygons.map((p) => polygonBounds(p));

    this.diameter = diameter;
  }

  /**
   * @param point Cursor location, in database coordinates.
   */
  public setCursor(point: Position): void {
    const grid = this.grids[this.activeGrid];

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
      const result = distanceToPolygon(
        this.areas[this.activeGrid].polygon,
        [p.point[0] + offset[0], p.point[1] + offset[1]],
        undefined,
        p.edges
      );

      p.display = result.distance >= 0;
    });
  }

  public updateGrid(index: number): GridPoints {
    const polygon = this.areas[index].polygon;

    let grid: GridPoints = this.grids[index];

    if (grid) {
      grid.interiorPoints = [];
      grid.edgePoints = [];
      grid.offset = [0, 0];
    } else {
      grid = {
        interiorPoints: [],
        edgePoints: [],
        offset: [0, 0],
      };
      this.grids[index] = grid;
    }

    const bounds = this.bounds[index];
    const padding = this._diameter / root3;

    const corners = (
      [
        [bounds[0] - padding, bounds[1] - padding],
        [bounds[2] + padding, bounds[1] - padding],
        [bounds[2] + padding, bounds[3] + padding],
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

        const { distance, closest } = distanceToPolygon(
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

  public closestPolygon(
    point: Position,
    maxDistance: number
  ): {
    distance: number | undefined;
    point: Vector;
  } {
    const min = {
      distance: undefined as number | undefined,
      point: new Vector(0, 0),
    };

    this.areas
      .filter((_, i) => pointInBounds(point, this.bounds[i], maxDistance))
      .forEach(({ polygon }) => {
        const result = distanceToPolygon(polygon, point);

        const distance = Math.abs(result.distance);

        if (
          distance <= maxDistance &&
          (min.distance === undefined || distance < min.distance)
        ) {
          min.distance = distance;
          min.point.copy(result.point);
        }
      });

    return min;
  }

  public splitPolygon(index: number, line: Position[]): number[] {
    const parent = this.areas[index];

    const children = splitPolygon(parent.polygon, line).map((polygon) => ({
      polygon,
      siblings: [] as Area[],
      parent,
    }));

    children[0].siblings.push(children[1]);
    children[1].siblings.push(children[0]);

    this.areas.splice(index, 1, children[0]);
    const length = this.areas.push(children[1]);

    [index, length - 1].forEach((i) => {
      this.bounds[i] = polygonBounds(this.areas[i].polygon);
      this.updateGrid(i);
    });

    return [index, length - 1];
  }

  public mergePolygon(index: number): number {
    const child = this.areas[index];

    if (!child.parent) {
      throw new Error("Can't merge polygon without a parent");
    }

    child.siblings.forEach((s) => {
      const index = this.areas.indexOf(s);

      this.areas.splice(index, 1);
      this.grids.splice(index, 1);
      this.bounds.splice(index, 1);
    });

    return this.areas.push(child.parent);
  }
}

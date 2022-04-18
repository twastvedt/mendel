import { Variety, Position } from "@mendel/common";
import { Tool } from "./Tool";
import { AddPlantAction } from "../actions/AddPlantAction";
import { Action } from "../actions/Action";
import { state } from "../Store";
import { Vector } from "../Vector";
import plantComponent from "../components/PlantComponent.vue";

export class DrawPlantTool implements Tool {
  private location?: Position;
  private cursor = new Vector(0, 0);
  private tempVec = new Vector(0, 0);
  private lastClosestIndex?: number;

  public helpText = "Click to draw a plant.";
  public cursorComponent = plantComponent;
  public cursorProps: Record<string, unknown> = {
    transform: "",
    interactive: false,
  };

  public constructor(private variety: Variety) {
    this.cursorProps.variety = variety;
  }

  public start(): void {
    this.location = [0, 0];
  }
  public stop(): void {
    if (this.location) {
      delete this.location;
    }
  }

  public setTransform(): void {
    if (this.location) {
      this.cursorProps.transform = state.makeTransform(this.location);
    }
  }

  public onCursorMove(point: Position): void {
    if (this.location && this.variety.family) {
      this.cursor.set(...point);

      if (state.garden) {
        const thisRadius = this.variety.family.spacing / 2;

        this.lastClosestIndex = state.garden.delaunay.find(
          ...point,
          this.lastClosestIndex
        );

        const neighbors = state.garden.delaunay.neighbors(
          this.lastClosestIndex
        );

        const closestPlants: {
          location: Vector;
          overlap: number;
          distance: number;
        }[] = [];

        for (const i of [...neighbors, this.lastClosestIndex]) {
          const delaunayPoint = state.garden.delaunayPoints[i];

          if (delaunayPoint?.planting.variety?.family) {
            const plantVector = Vector.fromArray(delaunayPoint.point);

            const distance =
              delaunayPoint.planting.variety.family.spacing / 2 + thisRadius;
            const overlap = distance - this.cursor.distanceTo(plantVector);

            if (overlap > 0) {
              closestPlants.push({ location: plantVector, overlap, distance });
            }
          }

          if (closestPlants.length === 0) {
            this.location = point;
          } else if (closestPlants.length === 1) {
            const closest = closestPlants[0];

            Vector.subtract(this.cursor, closest.location, this.tempVec);

            this.tempVec.length = closest.overlap;

            this.cursor.add(this.tempVec);

            [...this.location] = [this.cursor.x, this.cursor.y] as const;
          } else {
            const r0 = closestPlants[0].distance;
            const r1 = closestPlants[1].distance;

            const p0 = closestPlants[0].location;
            const p1 = closestPlants[1].location;

            const side =
              (p1.x - p0.x) * (this.cursor.y - p0.y) >
              (p1.y - p0.y) * (this.cursor.x - p0.x);

            Vector.subtract(p1, p0, this.tempVec);

            const d = this.tempVec.length;
            const a = (r0 ** 2 - r1 ** 2 + d ** 2) / (2 * d);
            const h = Math.sqrt(r0 ** 2 - a ** 2);

            this.tempVec.length = a;

            if (side) {
              [...this.location] = [
                p0.x + this.tempVec.x - (h * (p1.y - p0.y)) / d,
                p0.y + this.tempVec.y + (h * (p1.x - p0.x)) / d,
              ] as const;
            } else {
              [...this.location] = [
                p0.x + this.tempVec.x + (h * (p1.y - p0.y)) / d,
                p0.y + this.tempVec.y - (h * (p1.x - p0.x)) / d,
              ] as const;
            }
          }
        }
      } else {
        [...this.location] = [this.cursor.x, this.cursor.y] as const;
      }

      this.setTransform();
    }
  }

  public onClick(): Action {
    if (!this.location || this.variety.id === undefined) {
      throw new Error("No location or variety id?");
    }

    return new AddPlantAction(this.location, this.variety.id);
  }
}

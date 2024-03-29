import type { Variety, Position } from "@mendel/common";
import type { Tool } from "./Tool";
import { AddPlantAction } from "../actions/AddPlantAction";
import type { Action } from "../actions/Action";
import { Vector } from "../Vector";
import plantComponent from "../components/PlantComponent.vue";
import type { UiElementType } from "../types/entityTypes";
import { useGardenStore } from "@/state/gardenStore";
import { useRootStore } from "@/state/rootStore";
import { markRaw } from "vue";
import { makeTransform } from "@/services/projection";

export class DrawPlantTool implements Tool {
  private location?: Position;
  private active = false;
  private cursor = new Vector(0, 0);
  private tempVec = new Vector(0, 0);
  private lastClosestIndex?: number;
  private gardenStore = useGardenStore();
  private rootStore = useRootStore();

  public helpText = "Click to draw a plant.";
  public cursorComponent = markRaw(plantComponent);
  public cursorProps: Record<string, unknown> = {
    transform: "",
    interactive: false,
  };

  public interactiveElements = new Set<UiElementType>(["bed"]);

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
      this.cursorProps.transform = makeTransform(this.location);
    }
  }

  public onHover(point: Position, index?: number): void {
    this.active = index != undefined;
  }

  public onCursorMove(point: Position): void {
    if (this.location && this.variety.family && this.active) {
      this.cursor.set(...point);

      if (!this.rootStore.drawSettings.overlap && this.gardenStore.delaunay) {
        const thisRadius = this.variety.family.spacing / 2;

        this.lastClosestIndex = this.gardenStore.delaunay.find(
          ...point,
          this.lastClosestIndex,
        );

        const neighbors = this.gardenStore.delaunay.neighbors(
          this.lastClosestIndex,
        );

        const closestPlants: {
          location: Vector;
          overlap: number;
          distance: number;
        }[] = [];

        for (const i of [...neighbors, this.lastClosestIndex]) {
          if (i < 0) {
            continue;
          }

          const delaunayPoint = this.gardenStore.delaunayPoints[i];

          if (delaunayPoint.planting?.variety?.family) {
            const plantVector = Vector.fromArray(
              delaunayPoint.location.coordinates,
            );

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

import { Variety } from "@/entity/Variety";
import { Tool } from "./Tool";
import { AddPlantAction } from "../actions/AddPlantAction";
import { Action } from "../actions/Action";
import { Plant } from "@/entity/Plant";
import Store from "../Store";
import { Vector } from "../Vector";
import plantComponent from "../components/PlantComponent.vue";

export class DrawPlantTool implements Tool {
  public Stop(): void {
    if (this.plant) {
      Store.state.removePlant(this.plant);

      delete this.plant;
    }
  }

  private plant?: Plant;

  private cursor = new Vector(0, 0);
  private tempVec = new Vector(0, 0);
  private lastClosestIndex?: number;

  public constructor(private variety: Variety) {}

  public cursorComponent = plantComponent;
  public cursorProps: Record<string, unknown> = {
    transform: "",
  };

  public setTransform(): void {
    if (this.plant) {
      this.cursorProps.transform = `translate(${Store.state
        .projection(this.plant.location.coordinates as [number, number])
        ?.join(" ")})`;
    }
  }

  public OnCursorMove(x: number, y: number): void {
    if (this.plant?.variety?.family?.spacing !== undefined) {
      this.cursor.set(x, y);

      if (Store.state.delaunay) {
        const thisRadius = this.plant.variety.family.spacing / 2;

        this.lastClosestIndex = Store.state.delaunay.find(
          x,
          y,
          this.lastClosestIndex
        );

        const neighbors = Store.state.delaunay.neighbors(this.lastClosestIndex);

        const closestPlants: {
          location: Vector;
          overlap: number;
          distance: number;
        }[] = [];

        for (const i of [...neighbors, this.lastClosestIndex]) {
          const plant = Store.state.garden?.plants[i];

          if (plant?.variety?.family) {
            const plantVector = Vector.fromArray(plant.location.coordinates);

            const distance = plant.variety.family.spacing / 2 + thisRadius;
            const overlap = distance - this.cursor.distanceTo(plantVector);

            if (overlap > 0) {
              closestPlants.push({ location: plantVector, overlap, distance });
            }
          }

          if (closestPlants.length === 0) {
            [...this.plant.location.coordinates] = [x, y];
          } else if (closestPlants.length === 1) {
            const closest = closestPlants[0];

            Vector.subtract(this.cursor, closest.location, this.tempVec);

            this.tempVec.length = closest.overlap;

            this.cursor.add(this.tempVec);

            [...this.plant.location.coordinates] = [
              this.cursor.x,
              this.cursor.y,
            ];
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
              [...this.plant.location.coordinates] = [
                p0.x + this.tempVec.x - (h * (p1.y - p0.y)) / d,
                p0.y + this.tempVec.y + (h * (p1.x - p0.x)) / d,
              ];
            } else {
              [...this.plant.location.coordinates] = [
                p0.x + this.tempVec.x + (h * (p1.y - p0.y)) / d,
                p0.y + this.tempVec.y - (h * (p1.x - p0.x)) / d,
              ];
            }
          }
        }
      } else {
        [...this.plant.location.coordinates] = [this.cursor.x, this.cursor.y];
      }

      this.setTransform();
    }
  }

  public OnClick(x: number, y: number, plant?: Plant): Action {
    if (this.plant) {
      return new AddPlantAction(Plant.copy(this.plant));
    }

    throw new Error("No action to save?");
  }

  public Start(): void {
    this.plant = new Plant();
    this.plant.variety = this.variety;
    this.plant.location = {
      type: "Point",
      coordinates: [0, 0],
    };
    this.plant.gardenId = Store.state.garden?.id;

    this.cursorProps.plant = this.plant;
  }
}

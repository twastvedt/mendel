import { Variety } from "@/entity/Variety";
import { Tool } from "./Tool";
import { AddPlantAction } from "../actions/AddPlantAction";
import { Action } from "../actions/Action";
import { Garden } from "@/entity/Garden";
import { Plant } from "@/entity/Plant";

export class DrawPlantTool extends Tool {
  public Stop(): void {
    if (this.plant?.id) {
      this.garden.removePlant(this.plant.id);

      delete this.plant;
    }
  }

  private plant?: Plant;

  public constructor(private variety: Variety, garden: Garden) {
    super(garden);
  }

  public OnCursorMove(x: number, y: number): void {
    if (this.plant) {
      this.plant.location.coordinates = [x, y];
    }
  }

  public OnClick(x: number, y: number): Action {
    if (this.plant) {
      return new AddPlantAction(this.plant.cleanCopy());
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
    this.plant.gardenId = this.garden.id;

    this.garden.plants.push(this.plant);
  }
}

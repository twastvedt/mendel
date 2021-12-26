import { Variety } from "@/entity/Variety";
import { Tool } from "./Tool";
import { AddPlantAction } from "../actions/AddPlantAction";
import { Action } from "../actions/Action";
import { Plant } from "@/entity/Plant";
import Store from "../Store";

export class DrawPlantTool extends Tool {
  public Stop(): void {
    if (this.plant) {
      this.state.removePlant(this.plant);

      delete this.plant;
    }
  }

  private plant?: Plant;

  public constructor(private variety: Variety, state: Store) {
    super(state);
  }

  public OnCursorMove(x: number, y: number): void {
    if (this.plant) {
      this.plant.location.coordinates = [x, y];
    }
  }

  public OnClick(x: number, y: number, plant?: Plant): Action {
    if (this.plant) {
      return new AddPlantAction(this.plant.copy());
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
    this.plant.gardenId = this.state.garden?.id;

    this.state.garden?.plants.push(this.plant);
  }
}

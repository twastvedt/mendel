import { Tool } from "./Tool";
import { Action } from "../actions/Action";
import Store from "../Store";
import { DeletePlantAction } from "../actions/DeletePlantAction";
import { Plant } from "@/entity/Plant";

export class DeletePlantTool extends Tool {
  public Stop(): void {}

  public constructor(state: Store) {
    super(state);
  }

  public OnCursorMove(x: number, y: number): void {}

  public OnClick(x: number, y: number, plant?: Plant): Action | void {
    if (plant) {
      return new DeletePlantAction(plant);
    }
  }

  public Start(): void {}
}

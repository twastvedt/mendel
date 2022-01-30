import { Tool } from "./Tool";
import { Action } from "../actions/Action";
import { DeletePlantAction } from "../actions/DeletePlantAction";
import { Plant } from "@/entity/Plant";
import { ElementType } from "../Store";

export class DeletePlantTool implements Tool {
  public Stop(): void {}

  public OnCursorMove(x: number, y: number): void {}

  public interactiveElements = new Set<ElementType>(["plant"]);

  public OnClick(x: number, y: number, plant?: Plant): Action | void {
    if (plant) {
      return new DeletePlantAction(plant);
    }
  }

  public Start(): void {}
}

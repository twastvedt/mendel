import { Tool } from "./Tool";
import { Action } from "../actions/Action";
import { ElementType } from "../Store";
import { DeletePlantingAction } from "../actions/DeletePlantingAction";
import { EntityId, Planting, Position } from "@mendel/common";

export class DeletePlantingTool implements Tool {
  public interactiveElements = new Set<ElementType>(["planting"]);

  public helpText = "Click on a planting to delete it and all of its plants.";

  public onClick(point: Position, planting?: Planting): Action | void {
    if (planting?.id == undefined) {
      return;
    }

    return new DeletePlantingAction(planting as EntityId<Planting>);
  }
}

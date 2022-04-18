import { Tool } from "./Tool";
import { Action } from "../actions/Action";
import { DeletePlantAction } from "../actions/DeletePlantAction";
import { ElementType } from "../Store";
import { EntityId, Planting, Position } from "@mendel/common";

export class DeletePlantTool implements Tool {
  public helpText = "Click on a plant to delete it.";

  public interactiveElements = new Set<ElementType>(["planting"]);

  public onClick(point: Position, planting?: Planting): Action | void {
    if (planting?.id == undefined) {
      return;
    }

    return new DeletePlantAction(planting as EntityId<Planting>, point);
  }
}

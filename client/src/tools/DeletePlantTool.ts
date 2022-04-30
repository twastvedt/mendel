import { Tool } from "./Tool";
import { Action } from "../actions/Action";
import { DeletePlantAction } from "../actions/DeletePlantAction";
import { ClickData, ElementType } from "../state/State";
import { EntityId, Planting, Position } from "@mendel/common";

export class DeletePlantTool implements Tool {
  public helpText = "Click on a plant to delete it.";

  public interactiveElements = new Set<ElementType>(["plant"]);

  public onClick(point: Position, data?: ClickData["plant"]): Action | void {
    if (data?.planting.id == undefined) {
      return;
    }

    return new DeletePlantAction(
      data.planting as EntityId<Planting>,
      data.position
    );
  }
}

import { Tool } from "./Tool";
import { Action } from "../actions/Action";
import { DeletePlantAction } from "../actions/DeletePlantAction";
import { ElementType } from "../Store";
import { EntityBase, EntityId, Plant, Position } from "@mendel/common";

export class DeletePlantTool implements Tool {
  public helpText = "Click on a plant to delete it.";

  public interactiveElements = new Set<ElementType>(["plant"]);

  public onClick(point: Position, entity?: EntityBase): Action | void {
    if (entity?.id == undefined) {
      return;
    }

    return new DeletePlantAction(entity as EntityId<Plant>);
  }
}

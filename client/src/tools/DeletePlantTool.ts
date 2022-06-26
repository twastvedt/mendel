import { Tool } from "./Tool";
import { Action } from "../actions/Action";
import { DeletePlantAction } from "../actions/DeletePlantAction";
import { EntityId, Planting, Position } from "@mendel/common";
import { PlantElement, UiElementType } from "../types/entityTypes";

export class DeletePlantTool implements Tool {
  public helpText = "Click on a plant to delete it.";

  public interactiveElements = new Set<UiElementType>(["plant"]);

  public onClick(point: Position, plant?: PlantElement): Action | void {
    if (plant?.item.id == undefined) {
      return;
    }

    return new DeletePlantAction(
      plant.item as EntityId<Planting>,
      plant.position
    );
  }
}

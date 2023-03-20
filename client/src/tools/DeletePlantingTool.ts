import type { Tool } from "./Tool";
import type { Action } from "../actions/Action";
import { DeletePlantingAction } from "../actions/DeletePlantingAction";
import type { EntityId, Planting, Position } from "@mendel/common";
import type { PlantingElement, UiElementType } from "../types/entityTypes";

export class DeletePlantingTool implements Tool {
  public interactiveElements = new Set<UiElementType>(["planting"]);

  public helpText = "Click on a planting to delete it and all of its plants.";

  public onClick(point: Position, planting?: PlantingElement): Action | void {
    if (planting?.item.id == undefined) {
      return;
    }

    return new DeletePlantingAction(planting.item as EntityId<Planting>);
  }
}

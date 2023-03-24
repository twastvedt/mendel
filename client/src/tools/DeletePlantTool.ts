import type { Tool } from "./Tool";
import type { Action } from "../actions/Action";
import { DeletePlantAction } from "../actions/DeletePlantAction";
import type { HasId, Position } from "@mendel/common";
import type { PlantElement, UiElementType } from "../types/entityTypes";
import type { Plant } from "@mendel/common/src/entity/Plant";

export class DeletePlantTool implements Tool {
  public helpText = "Click on a plant to delete it.";

  public interactiveElements = new Set<UiElementType>(["plant"]);

  public onClick(point: Position, plant?: PlantElement): Action | void {
    if (plant?.item.id == undefined) {
      return;
    }

    return new DeletePlantAction(plant.item as HasId<Plant>);
  }
}

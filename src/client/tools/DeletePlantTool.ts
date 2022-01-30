import { Tool } from "./Tool";
import { Action } from "../actions/Action";
import { DeletePlantAction } from "../actions/DeletePlantAction";
import { ElementType } from "../Store";
import { DeletePlantingAction } from "../actions/DeletePlantingAction";
import { EntityBase } from "@/entity/EntityBase";
import { isPlant, isPlanting } from "../types/entityTypes";
import { EntityId } from "@/api/BaseApi";
import { Planting } from "@/entity/Planting";
import { Plant } from "@/entity/Plant";

export class DeletePlantTool implements Tool {
  public Stop(): void {}

  public OnCursorMove(x: number, y: number): void {}

  public interactiveElements = new Set<ElementType>(["plant", "planting"]);

  public OnClick(x: number, y: number, entity?: EntityBase): Action | void {
    if (entity?.id == undefined) {
      return;
    }

    if (isPlant(entity)) {
      return new DeletePlantAction(entity as EntityId<Plant>);
    } else if (isPlanting(entity)) {
      return new DeletePlantingAction(entity as EntityId<Planting>);
    }
  }

  public Start(): void {}
}

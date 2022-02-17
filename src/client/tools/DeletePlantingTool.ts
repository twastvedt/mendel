import { Tool } from "./Tool";
import { Action } from "../actions/Action";
import { ElementType } from "../Store";
import { DeletePlantingAction } from "../actions/DeletePlantingAction";
import { EntityBase } from "@/entity/EntityBase";
import { EntityId } from "@/api/BaseApi";
import { Planting } from "@/entity/Planting";
import { Position } from "@/entity/geoJson";

export class DeletePlantingTool implements Tool {
  public Stop(): void {}

  public OnCursorMove(point: Position): void {}

  public interactiveElements = new Set<ElementType>(["planting"]);

  public OnClick(point: Position, entity?: EntityBase): Action | void {
    if (entity?.id == undefined) {
      return;
    }

    return new DeletePlantingAction(entity as EntityId<Planting>);
  }

  public Start(): void {}
}

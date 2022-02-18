import { Tool } from "./Tool";
import { Action } from "../actions/Action";
import { DeletePlantAction } from "../actions/DeletePlantAction";
import { ElementType } from "../Store";
import { EntityBase } from "@/entity/EntityBase";
import { EntityId } from "@/api/BaseApi";
import { Plant } from "@/entity/Plant";
import { Position } from "@/entity/geoJson";

export class DeletePlantTool implements Tool {
  public Stop(): void {}

  public helpText = "Click on a plant to delete it.";

  public OnCursorMove(point: Position): void {}

  public interactiveElements = new Set<ElementType>(["plant"]);

  public OnClick(point: Position, entity?: EntityBase): Action | void {
    if (entity?.id == undefined) {
      return;
    }

    return new DeletePlantAction(entity as EntityId<Plant>);
  }

  public Start(): void {}
}

import { EntityId } from "@/api/BaseApi";
import { plantingApi } from "@/api/PlantingApi";
import { Planting } from "@/entity/Planting";
import "../apiRequest";
import { Store } from "../Store";
import { Action } from "./Action";

export class DeletePlantingAction extends Action {
  public constructor(private planting: EntityId<Planting>) {
    super();
  }

  public async Do(state: Store): Promise<void> {
    await super.Do(state);

    if (state.garden) {
      state.removePlanting(this.planting.id);

      await plantingApi.delete.request({
        routeParams: { id: this.planting.id },
      });
    }
  }

  public async Undo(state: Store): Promise<void> {
    await super.Undo(state);

    const newPlanting = await plantingApi.create.request({
      data: this.planting,
    });

    state.inflatePlanting(newPlanting);

    Object.assign(this.planting, newPlanting);

    state.garden?.plantings.push(this.planting);
  }
}

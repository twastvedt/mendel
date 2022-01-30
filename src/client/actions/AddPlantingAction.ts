import { plantingApi } from "@/api/PlantingApi";
import { Planting } from "@/entity/Planting";
import "../apiRequest";
import Store from "../Store";
import { Action } from "./Action";

export class AddPlantingAction extends Action {
  public constructor(private planting: Planting) {
    super();
  }

  public async Do(state: Store): Promise<void> {
    await super.Do(state);

    state.garden?.plantings.push(this.planting as Planting);

    const newPlanting = await plantingApi.create.request({
      data: Planting.cleanCopy(this.planting),
    });

    Object.assign(this.planting, newPlanting);
  }

  public async Undo(state: Store): Promise<void> {
    await super.Undo(state);

    if (this.planting.id && state.garden) {
      await plantingApi.delete.request({
        routeParams: { id: this.planting.id },
      });

      state.removePlanting(this.planting.id);

      delete this.planting.id;
    }
  }
}

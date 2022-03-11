import { EntityId, plantingApi, Planting } from "@mendel/common";
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

    const newPlanting = (await plantingApi.create.request({
      data: this.planting,
    })) as Planting;

    state.addPlanting(Object.assign(this.planting, newPlanting));
  }
}

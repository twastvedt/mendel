import { plantingApi, Planting } from "@mendel/common/src";
import type { EntityId } from "@mendel/common";
import type { State } from "../state/State";
import { Action } from "./Action";

export class DeletePlantingAction extends Action {
  public constructor(private planting: EntityId<Planting>) {
    super();
  }

  public async Do(state: State): Promise<void> {
    await super.Do(state);

    state.db?.removePlanting(this.planting.id);

    await plantingApi.delete.request({
      routeParams: { id: this.planting.id },
    });
  }

  public async Undo(state: State): Promise<void> {
    await super.Undo(state);

    const newPlanting = (await plantingApi.create.request({
      data: this.planting,
    })) as Planting;

    state.db?.addPlanting(Object.assign(this.planting, newPlanting));
  }
}

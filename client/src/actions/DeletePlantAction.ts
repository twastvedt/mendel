import { plantApi, Plant, EntityId } from "@mendel/common";
import { Store } from "../Store";
import { Action } from "./Action";

export class DeletePlantAction extends Action {
  public constructor(private plant: EntityId<Plant>) {
    super();
  }

  public async Do(state: Store): Promise<void> {
    await super.Do(state);

    if (state.garden) {
      state.removePlant(this.plant.id);

      await plantApi.delete.request({
        routeParams: { id: this.plant.id },
      });
    }
  }

  public async Undo(state: Store): Promise<void> {
    await super.Undo(state);

    const newPlant = (await plantApi.create.request({
      data: this.plant,
    })) as Plant;

    state.addPlant(Object.assign(this.plant, newPlant));
  }
}

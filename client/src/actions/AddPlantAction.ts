import { plantApi, Plant } from "@mendel/common";
import { Store } from "../Store";
import { Action } from "./Action";

export class AddPlantAction extends Action {
  public constructor(private plant: Plant) {
    super();
  }

  public async Do(state: Store): Promise<void> {
    await super.Do(state);

    state.addPlant(this.plant);

    state.updateDelaunay();

    const newPlant = await plantApi.create.request({
      data: Plant.cleanCopy(this.plant),
    });

    Object.assign(this.plant, newPlant);
  }

  public async Undo(state: Store): Promise<void> {
    await super.Undo(state);

    if (this.plant.id && state.garden) {
      await plantApi.delete.request({
        routeParams: { id: this.plant.id },
      });

      state.removePlant(this.plant.id);

      delete this.plant.id;
    }
  }
}
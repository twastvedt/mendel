import { plantApi } from "@/api/PlantApi";
import { Plant } from "@/entity/Plant";
import "../apiRequest";
import { Store } from "../Store";
import { Action } from "./Action";

export class AddPlantAction extends Action {
  public constructor(private plant: Plant) {
    super();
  }

  public async Do(state: Store): Promise<void> {
    await super.Do(state);

    state.garden?.plants.push(this.plant as Plant);

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

import { plantApi } from "@/api/PlantApi";
import { Plant } from "@/entity/Plant";
import "../apiRequest";
import Store from "../Store";
import { Action } from "./Action";

export class DeletePlantAction extends Action {
  public constructor(private plant: Plant) {
    super();
  }

  public async Do(state: Store): Promise<void> {
    await super.Do(state);

    if (state.garden) {
      await plantApi.delete.request({
        routeParams: { id: this.plant.id },
      });

      state.removePlant(this.plant.id);
    }
  }

  public async Undo(state: Store): Promise<void> {
    await super.Undo(state);

    const newPlant = await plantApi.create.request({
      data: this.plant,
    });

    state.inflatePlant(newPlant);

    Object.assign(this.plant, newPlant);

    state.garden?.plants.push(this.plant as Plant);
  }
}

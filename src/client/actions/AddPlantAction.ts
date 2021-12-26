import { EntityNoId } from "@/api/BaseApi";
import { plantApi } from "@/api/PlantApi";
import { Plant } from "@/entity/Plant";
import "../apiRequest";
import Store from "../Store";
import { Action } from "./Action";

export class AddPlantAction extends Action {
  public constructor(private plant: EntityNoId<Plant>) {
    super();
  }

  public async Do(state: Store): Promise<void> {
    await super.Do(state);

    const newPlant = await plantApi.create.request({
      data: this.plant,
    });

    state.inflatePlant(newPlant);

    Object.assign(this.plant, newPlant);

    state.garden?.plants.push(this.plant as Plant);
  }

  public async Undo(state: Store): Promise<void> {
    await super.Undo(state);

    if (this.plant.id && state.garden) {
      await plantApi.delete.request({
        routeParams: { id: this.plant.id.toString() },
      });

      state.garden.removePlant(this.plant.id);

      delete this.plant.id;
    }
  }
}

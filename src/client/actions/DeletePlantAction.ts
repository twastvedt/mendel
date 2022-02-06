import { plantApi } from "@/api/PlantApi";
import { Plant } from "@/entity/Plant";
import "../apiRequest";
import { EntityId } from "@/api/BaseApi";
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

    const newPlant = await plantApi.create.request({
      data: this.plant,
    });

    state.inflatePlant(newPlant);

    Object.assign(this.plant, newPlant);

    state.garden?.plants.push(this.plant);
  }
}

import { plantingApi } from "@mendel/common";
import type { HasId, PlantingLocal , Planting } from "@mendel/common";
import { Action } from "./Action";
import { useGardenStore } from "@/state/gardenStore";

export class DeletePlantingAction extends Action {
  _gardenStore = useGardenStore();

  public constructor(public _planting: HasId<PlantingLocal>) {
    super();
  }

  public async Do(): Promise<void> {
    await super.Do();

    this._gardenStore.removePlanting(this._planting.id);

    await plantingApi.delete.request({
      routeParams: { id: this._planting.id },
    });
  }

  public async Undo(): Promise<void> {
    await super.Undo();

    const newPlanting = (await plantingApi.create.request({
      data: this._planting,
    })) as Planting;

    this._gardenStore.addPlanting(Object.assign(this._planting, newPlanting));
  }
}

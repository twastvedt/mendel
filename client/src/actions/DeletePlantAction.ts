import type { HasId, PlantLocal } from "@mendel/common";
import { Action } from "./Action";
import { useGardenStore } from "@/state/gardenStore";

export class DeletePlantAction extends Action {
  _gardenStore = useGardenStore();

  public constructor(public _plant: HasId<PlantLocal>) {
    super();
  }

  public async Do(): Promise<void> {
    await super.Do();

    await this._gardenStore.removePlant(this._plant);
  }

  public async Undo(): Promise<void> {
    await super.Undo();

    if (this._plant.planting?.varietyId === undefined) {
      return;
    }

    this._gardenStore.addPlant(
      this._plant.location.coordinates,
      this._plant.planting.varietyId
    );
  }
}

import type { PlantingLocal } from "@mendel/common";
import { Action } from "./Action";
import { useGardenStore } from "@/state/gardenStore";

export class AddPlantingAction extends Action {
  _gardenStore = useGardenStore();

  public constructor(public _planting: PlantingLocal) {
    super();
  }

  public async Do(): Promise<void> {
    await super.Do();

    await this._gardenStore.addPlanting(this._planting);
  }

  public async Undo(): Promise<void> {
    await super.Undo();

    await this._gardenStore.removePlanting(this._planting);
  }
}

import type { Planting } from "@mendel/common";
import { Action } from "./Action";
import { useGardenStore } from "@/state/gardenStore";

export class AddPlantingAction extends Action {
  private gardenStore = useGardenStore();

  public constructor(private planting: Planting) {
    super();
  }

  public async Do(): Promise<void> {
    await super.Do();

    await this.gardenStore.addPlanting(this.planting);
  }

  public async Undo(): Promise<void> {
    await super.Undo();

    await this.gardenStore.removePlanting(this.planting);
  }
}

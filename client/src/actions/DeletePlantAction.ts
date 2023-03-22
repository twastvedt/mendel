import type { EntityId } from "@mendel/common";
import type { Plant } from "@mendel/common/src/entity/Plant";
import { Action } from "./Action";
import { useGardenStore } from "@/state/gardenStore";

export class DeletePlantAction extends Action {
  private gardenStore = useGardenStore();

  public constructor(private plant: EntityId<Plant>) {
    super();
  }

  public async Do(): Promise<void> {
    await super.Do();

    await this.gardenStore.removePlant(this.plant);
  }

  public async Undo(): Promise<void> {
    await super.Undo();

    if (this.plant.planting?.varietyId === undefined) {
      return;
    }

    this.gardenStore.addPlant(
      this.plant.location.coordinates,
      this.plant.planting.varietyId
    );
  }
}

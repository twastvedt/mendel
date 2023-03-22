import type { Position, EntityId } from "@mendel/common";
import type { Plant } from "@mendel/common/src/entity/Plant";
import { Action } from "./Action";
import { useGardenStore } from "@/state/gardenStore";

export class AddPlantAction extends Action {
  private plant?: EntityId<Plant>;
  private gardenStore = useGardenStore();

  public constructor(private location: Position, private varietyId: number) {
    super();
  }

  public async Do(): Promise<void> {
    await super.Do();

    this.plant = await this.gardenStore.addPlant(this.location, this.varietyId);
  }

  public async Undo(): Promise<void> {
    await super.Undo();

    if (this.plant?.id !== undefined) {
      await this.gardenStore.removePlant(this.plant);

      delete this.plant;
    }
  }
}

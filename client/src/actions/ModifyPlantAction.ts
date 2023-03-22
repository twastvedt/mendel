import type { EntityId } from "@mendel/common";
import type { Plant } from "@mendel/common/src/entity/Plant";
import { Action } from "./Action";
import { useGardenStore } from "@/state/gardenStore";

export class ModifyPlantAction extends Action {
  private undoChanges?: Partial<Plant>;
  private gardenStore = useGardenStore();

  public constructor(
    private plant: EntityId<Plant>,
    private changes: Partial<Plant>
  ) {
    super();
  }

  public async Do(): Promise<void> {
    await super.Do();

    this.undoChanges = {};

    Object.keys(this.changes).forEach((k) => {
      this.undoChanges![k as keyof Plant] = this.plant[k as keyof Plant] as any;
    });

    await this.gardenStore.editPlant(this.plant.id, this.changes);
  }

  public async Undo(): Promise<void> {
    await super.Undo();

    if (this.undoChanges) {
      await this.gardenStore.editPlant(this.plant.id, this.undoChanges);

      delete this.undoChanges;
    }
  }
}

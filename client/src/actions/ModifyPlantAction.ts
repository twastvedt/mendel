import type { HasId, Plant } from "@mendel/common";
import { Action } from "./Action";
import { useGardenStore } from "@/state/gardenStore";

export class ModifyPlantAction extends Action {
  _undoChanges?: Partial<Plant>;
  _gardenStore = useGardenStore();

  public constructor(
    public _plant: HasId<Plant>,
    public _changes: Partial<Plant>,
  ) {
    super();
  }

  public async Do(): Promise<void> {
    await super.Do();

    this._undoChanges = {};

    Object.keys(this._changes).forEach((k) => {
      this._undoChanges![k as keyof Plant] = this._plant[
        k as keyof Plant
      ] as any;
    });

    await this._gardenStore.editPlant(this._plant.id, this._changes);
  }

  public async Undo(): Promise<void> {
    await super.Undo();

    if (this._undoChanges) {
      await this._gardenStore.editPlant(this._plant.id, this._undoChanges);

      delete this._undoChanges;
    }
  }
}

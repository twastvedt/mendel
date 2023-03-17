import { EntityId } from "@mendel/common";
import { Plant } from "@mendel/common/src/entity/Plant";
import { State } from "../state/State";
import { Action } from "./Action";

export class ModifyPlantAction extends Action {
  private undoChanges?: Partial<Plant>;

  public constructor(
    private plant: EntityId<Plant>,
    private changes: Partial<Plant>
  ) {
    super();
  }

  public async Do(state: State): Promise<void> {
    if (!state.db) {
      return;
    }

    await super.Do(state);

    this.undoChanges = {};

    Object.keys(this.changes).forEach((k) => {
      this.undoChanges![k as keyof Plant] = this.plant[k as keyof Plant] as any;
    });

    await state.db.editPlant(this.plant.id, this.changes);
  }

  public async Undo(state: State): Promise<void> {
    await super.Undo(state);

    if (this.undoChanges) {
      await state.db?.editPlant(this.plant.id, this.undoChanges);

      delete this.undoChanges;
    }
  }
}

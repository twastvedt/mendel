import { Planting, Position, EntityId } from "@mendel/common";
import { State } from "../state/State";
import { Action } from "./Action";

export class ModifyPlantAction extends Action {
  private newPlanting?: EntityId<Planting>;
  public constructor(
    private planting: EntityId<Planting>,
    private location: Position,
    private changes: Partial<Planting>
  ) {
    super();
  }

  public async Do(state: State): Promise<void> {
    if (!this.planting.varietyId || !state.db) {
      return;
    }

    await super.Do(state);

    await state.db?.removePlant(this.planting, this.location);

    this.newPlanting = await state.db?.addPlant(
      this.location,
      this.planting.varietyId
    );
  }

  public async Undo(state: State): Promise<void> {
    await super.Undo(state);

    if (this.newPlanting?.id !== undefined) {
      await state.db?.removePlant(this.newPlanting, this.location);

      delete this.newPlanting;

      await state.db?.addPlantToPlanting(this.location, this.planting);
    }
  }
}

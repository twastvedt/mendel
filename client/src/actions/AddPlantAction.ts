import { Planting, Position, EntityId } from "@mendel/common";
import { State } from "../state/State";
import { Action } from "./Action";

export class AddPlantAction extends Action {
  private planting?: EntityId<Planting>;

  public constructor(private location: Position, private varietyId: number) {
    super();
  }

  public async Do(state: State): Promise<void> {
    await super.Do(state);

    this.planting = await state.db?.addPlant(this.location, this.varietyId);
  }

  public async Undo(state: State): Promise<void> {
    await super.Undo(state);

    if (this.planting?.id !== undefined) {
      await state.db?.removePlant(this.planting, this.location);

      delete this.planting;
    }
  }
}

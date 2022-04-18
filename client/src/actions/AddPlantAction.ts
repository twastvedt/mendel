import { Planting, Position, EntityId } from "@mendel/common";
import { Store } from "../Store";
import { Action } from "./Action";

export class AddPlantAction extends Action {
  private planting?: EntityId<Planting>;

  public constructor(private location: Position, private varietyId: number) {
    super();
  }

  public async Do(state: Store): Promise<void> {
    await super.Do(state);

    this.planting = await state.garden?.addPlant(this.location, this.varietyId);
  }

  public async Undo(state: Store): Promise<void> {
    await super.Undo(state);

    if (this.planting?.id !== undefined) {
      await state.garden?.removePlant(this.planting, this.location);

      delete this.planting;
    }
  }
}

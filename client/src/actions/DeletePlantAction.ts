import { Planting, EntityId, Position } from "@mendel/common";
import { Store } from "../Store";
import { Action } from "./Action";

export class DeletePlantAction extends Action {
  public constructor(
    private planting: EntityId<Planting>,
    private location: Position
  ) {
    super();
  }

  public async Do(state: Store): Promise<void> {
    await super.Do(state);

    await state.garden?.removePlant(this.planting, this.location);
  }

  public async Undo(state: Store): Promise<void> {
    await super.Undo(state);

    state.garden?.addPlantToPlanting(this.location, this.planting);
  }
}

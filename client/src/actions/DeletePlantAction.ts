import { Planting, EntityId, Position } from "@mendel/common";
import { State } from "../state/State";
import { Action } from "./Action";

export class DeletePlantAction extends Action {
  public constructor(
    private planting: EntityId<Planting>,
    private location: Position
  ) {
    super();
  }

  public async Do(state: State): Promise<void> {
    await super.Do(state);

    await state.db?.removePlant(this.planting, this.location);
  }

  public async Undo(state: State): Promise<void> {
    await super.Undo(state);

    state.db?.addPlantToPlanting(this.location, this.planting);
  }
}

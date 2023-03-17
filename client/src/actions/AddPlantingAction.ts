import { Planting } from "@mendel/common";
import { State } from "../state/State";
import { Action } from "./Action";

export class AddPlantingAction extends Action {
  public constructor(private planting: Planting) {
    super();
  }

  public async Do(state: State): Promise<void> {
    await super.Do(state);

    await state.db?.addPlanting(this.planting);
  }

  public async Undo(state: State): Promise<void> {
    await super.Undo(state);

    await state.db?.removePlanting(this.planting);
  }
}

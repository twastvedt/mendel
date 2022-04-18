import { Planting } from "@mendel/common";
import { Store } from "../Store";
import { Action } from "./Action";

export class AddPlantingAction extends Action {
  public constructor(private planting: Planting) {
    super();
  }

  public async Do(state: Store): Promise<void> {
    await super.Do(state);

    await state.garden?.addPlanting(this.planting);
  }

  public async Undo(state: Store): Promise<void> {
    await super.Undo(state);

    await state.garden?.removePlanting(this.planting);
  }
}

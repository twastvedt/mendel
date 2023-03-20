import type { Position, EntityId } from "@mendel/common";
import type { Plant } from "@mendel/common/src/entity/Plant";
import type { State } from "../state/State";
import { Action } from "./Action";

export class AddPlantAction extends Action {
  private plant?: EntityId<Plant>;

  public constructor(private location: Position, private varietyId: number) {
    super();
  }

  public async Do(state: State): Promise<void> {
    await super.Do(state);

    this.plant = await state.db?.addPlant(this.location, this.varietyId);
  }

  public async Undo(state: State): Promise<void> {
    await super.Undo(state);

    if (this.plant?.id !== undefined) {
      await state.db?.removePlant(this.plant);

      delete this.plant;
    }
  }
}

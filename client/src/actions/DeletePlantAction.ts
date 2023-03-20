import type { EntityId } from "@mendel/common";
import type { Plant } from "@mendel/common/src/entity/Plant";
import type { State } from "../state/State";
import { Action } from "./Action";

export class DeletePlantAction extends Action {
  public constructor(private plant: EntityId<Plant>) {
    super();
  }

  public async Do(state: State): Promise<void> {
    await super.Do(state);

    await state.db?.removePlant(this.plant);
  }

  public async Undo(state: State): Promise<void> {
    await super.Undo(state);

    if (this.plant.planting?.varietyId === undefined) {
      return;
    }

    state.db?.addPlant(
      this.plant.location.coordinates,
      this.plant.planting.varietyId
    );
  }
}

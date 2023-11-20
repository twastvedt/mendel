import type { HasId, Position, PlantLocal } from "@mendel/common";
import { Action } from "./Action";
import { useGardenStore } from "@/state/gardenStore";

export class AddPlantAction extends Action {
  _plant?: HasId<PlantLocal>;
  _gardenStore = useGardenStore();

  public constructor(
    public _location: Position,
    public _varietyId: number,
  ) {
    super();
  }

  public async Do(): Promise<void> {
    await super.Do();

    this._plant = await this._gardenStore.addPlant(
      this._location,
      this._varietyId,
    );
  }

  public async Undo(): Promise<void> {
    await super.Undo();

    if (this._plant?.id !== undefined) {
      await this._gardenStore.removePlant(this._plant);

      delete this._plant;
    }
  }
}

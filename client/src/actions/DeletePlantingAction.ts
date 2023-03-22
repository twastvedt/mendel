import { plantingApi, Planting } from "@mendel/common/src";
import type { EntityId } from "@mendel/common";
import { Action } from "./Action";
import { useGardenStore } from "@/state/gardenStore";

export class DeletePlantingAction extends Action {
  private gardenStore = useGardenStore();

  public constructor(private planting: EntityId<Planting>) {
    super();
  }

  public async Do(): Promise<void> {
    await super.Do();

    this.gardenStore.removePlanting(this.planting.id);

    await plantingApi.delete.request({
      routeParams: { id: this.planting.id },
    });
  }

  public async Undo(): Promise<void> {
    await super.Undo();

    const newPlanting = (await plantingApi.create.request({
      data: this.planting,
    })) as Planting;

    this.gardenStore.addPlanting(Object.assign(this.planting, newPlanting));
  }
}

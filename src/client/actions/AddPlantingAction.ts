import { plantingApi, PlantingWithPlants } from "@/api/PlantingApi";
import { Position } from "@/entity/geoJson";
import { Plant } from "@/entity/Plant";
import { Planting } from "@/entity/Planting";
import "../apiRequest";
import { Store } from "../Store";
import { Action } from "./Action";

export class AddPlantingAction extends Action {
  public constructor(
    private planting: Planting,
    private plantLocations?: Position[]
  ) {
    super();

    if (plantLocations) {
      this.plants = plantLocations.map((p) => {
        const plant = new Plant();
        plant.location = { coordinates: p, type: "Point" };
        plant.variety = planting.variety;
        plant.varietyId = planting.varietyId;

        return plant;
      });
    }
  }

  private plants?: Plant[];

  public async Do(state: Store): Promise<void> {
    await super.Do(state);

    if (!state.garden) {
      return;
    }

    state.addPlanting(this.planting);

    if (this.plantLocations && this.plants) {
      this.plants.forEach((p) => state.addPlant(p));

      const cleanPlanting = Planting.cleanCopy(
        this.planting
      ) as PlantingWithPlants;

      cleanPlanting.plants = this.plants.map((p) => Plant.cleanCopy(p));

      const newPlanting = await plantingApi.createWithPlants.request({
        data: cleanPlanting,
      });

      for (let i = 0; i < newPlanting.plants.length; i++) {
        Object.assign(this.plants[i], newPlanting.plants[i]);
      }

      Object.assign(this.planting, newPlanting);
    } else {
      const newPlanting = await plantingApi.create.request({
        data: Planting.cleanCopy(this.planting),
      });

      Object.assign(this.planting, newPlanting);
    }
  }

  public async Undo(state: Store): Promise<void> {
    await super.Undo(state);

    // TODO!
  }
}

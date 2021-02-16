import { Family } from "@/entity/Family";

import { request } from "./ApiRequest";
import { varietyApi } from "@/api/VarietyApi";
import { Bed } from "@/entity/Bed";
import { bedApi } from "@/api/BedApi";
import { Variety } from "@/entity/Variety";
import { gardenApi } from "@/api/GardenApi";
import { Garden } from "@/entity/Garden";

export enum Action {
  DrawPlant,
  DrawPlanting,
  Delete,
  None,
}

export default class Store {
  static state: Store;

  static initialize(): Store {
    Store.state = new Store();

    return Store.state;
  }

  loading = false;
  error = "";

  garden?: Garden;
  varietiesByFamily: Family[] = [];
  varieties: Variety[] = [];
  beds: Bed[] = [];

  action?: Action = undefined;
  actionId?: number = undefined;

  async loadGarden(): Promise<void> {
    this.error = "";
    this.loading = true;

    try {
      this.garden = await request(gardenApi.one, { id: 1 });

      this.beds = await request(bedApi.garden, { garden: this.garden.id });
    } catch (error) {
      this.error = error;
    }

    this.loading = false;
  }

  async loadVarieties(): Promise<void> {
    this.error = "";
    this.loading = true;

    try {
      this.varieties = [];

      this.varietiesByFamily = await request(varietyApi.allByFamily);

      this.varietiesByFamily.forEach((f) =>
        f.varieties.forEach((v) => {
          v.family = f;
          this.varieties.push(v);
        })
      );
    } catch (error) {
      this.error = error;
    }

    this.loading = false;
  }

  async addVariety(
    name: string,
    color: string,
    familyId: number
  ): Promise<void> {
    const newVariety = await request(varietyApi.create, {
      name,
      color,
      familyId,
    });

    const family = this.varietiesByFamily.find((f) => f.id === familyId);

    if (family) {
      newVariety.family = family;
      family.varieties.push(newVariety);
    }
  }

  setAction(action: Action, actionId: number): void {
    this.action = action;
    this.actionId = actionId;

    addEventListener("keyup", (event) => this.keyListener(event), {
      once: true,
    });
  }

  keyListener(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      this.action = Action.None;
      this.actionId = undefined;
    }
  }
}

import { Family } from "@/entity/Family";

import { request } from "./ApiRequest";
import { varietyApi } from "@/api/VarietyApi";
import { Bed } from "@/entity/Bed";
import { bedApi } from "@/api/BedApi";
import { Variety } from "@/entity/Variety";

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

  varietiesByFamily: Family[] = [];
  varieties: Variety[] = [];
  beds: Bed[] = [];

  action?: Action = undefined;
  actionId?: number = undefined;

  async loadBeds(): Promise<void> {
    this.error = "";
    this.loading = true;

    try {
      this.beds = await request(bedApi.all, undefined, undefined);
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

      this.varietiesByFamily = await request(
        varietyApi.allByFamily,
        undefined,
        undefined
      );

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
    const newVariety = await request(
      varietyApi.create,
      {
        name,
        color,
        familyId,
      },
      undefined
    );

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

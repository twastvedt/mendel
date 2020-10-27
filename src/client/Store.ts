import { Family } from "@/entity/Family";

import { request } from "./ApiRequest";
import { varietyApi } from "@/api/VarietyApi";
import { Bed } from "@/entity/Bed";
import { bedApi } from "@/api/BedApi";

export default class Store {
  static state: Store;

  static initialize(): Store {
    Store.state = new Store();

    return Store.state;
  }

  loading = false;
  error = "";

  varieties: Family[] = [];
  beds: Bed[] = [];

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
      this.varieties = await request(
        varietyApi.allByFamily,
        undefined,
        undefined
      );

      this.varieties.forEach((f) => f.varieties.forEach((v) => (v.family = f)));
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

    const family = this.varieties.find((f) => f.id === familyId);

    if (family) {
      newVariety.family = family;
      family.varieties.push(newVariety);
    }
  }
}

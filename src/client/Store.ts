import { Family } from "@/entity/Family";

import { request } from "./ApiRequest";
import { varietyApi } from "@/api/VarietyApi";
import { Variety } from "@/entity/Variety";

export default class Store {
  public static state: Store;

  public static initialize(): Store {
    Store.state = new Store();

    return Store.state;
  }

  loading = false;
  error = "";

  varieties: Family[] = [];

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

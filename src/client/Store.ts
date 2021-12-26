import { Family } from "@/entity/Family";

import "./apiRequest";
import { varietyApi } from "@/api/VarietyApi";
import { Variety } from "@/entity/Variety";
import { gardenApi } from "@/api/GardenApi";
import { Garden } from "@/entity/Garden";
import { Tool } from "./tools/Tool";
import { Action } from "./actions/Action";
import { Plant } from "@/entity/Plant";

export default class Store {
  static state: Store;

  static initialize(): Store {
    Store.state = new Store();

    return Store.state;
  }

  loading = false;
  error = "";

  garden?: Garden = undefined;
  varietiesByFamily: Family[] = [];
  varieties: Variety[] = [];

  actions: Action[] = [];

  tool?: Tool = undefined;

  cursor?: d3.Selection<SVGGElement, unknown, null, undefined>;

  async loadGarden(): Promise<void> {
    this.error = "";
    this.loading = true;

    try {
      this.garden = await gardenApi.one.request({ routeParams: { id: 1 } });

      this.garden.plants.forEach((p) => this.inflatePlant(p));
    } catch (error) {
      this.error = error as string;
    }

    this.loading = false;
  }

  async loadVarieties(): Promise<void> {
    this.error = "";
    this.loading = true;

    try {
      this.varieties = [];

      this.varietiesByFamily = await varietyApi.allByFamily.request();

      const symbols = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );

      let content = "";

      this.varietiesByFamily.forEach((f) => {
        content += f.icon.replace("symbol ", `symbol id="family-${f.id}" `);

        f.varieties.forEach((v) => {
          v.family = f;
          this.varieties.push(v);
        });
      });

      symbols.innerHTML = content;
      symbols.setAttribute("display", "none");

      document.body.prepend(symbols);
    } catch (error) {
      this.error = error as string;
    }

    this.loading = false;
  }

  onClick(x: number, y: number): void {
    if (this.tool && this.garden) {
      const action = this.tool.OnClick(x, y);

      action.Do(this);

      this.actions.push(action);
    }
  }

  async addVariety(
    name: string,
    color: string,
    familyId: number
  ): Promise<void> {
    const newVariety = await varietyApi.create.request({
      data: {
        name,
        color,
        familyId,
      },
    });

    const family = this.varietiesByFamily.find((f) => f.id === familyId);

    if (family) {
      newVariety.family = family;
      family.varieties.push(newVariety);
    }
  }

  inflatePlant(plant: Plant): Plant {
    if (plant.varietyId !== undefined) {
      plant.variety = this.varieties.find((v) => v.id === plant.varietyId);
    }

    if (plant.gardenId === this.garden?.id) {
      plant.garden === this.garden;
    }

    if (plant.plantingId !== undefined) {
      plant.planting ===
        this.garden?.plantings.find((p) => p.id === plant.plantingId);
    }

    return plant;
  }

  removePlant(id: number): void;
  removePlant(plant: Plant): void;
  removePlant(idOrPlant: Plant | number): void {
    if (!this.garden) {
      return;
    }

    let i;

    if (typeof idOrPlant === "number") {
      i = this.garden.plants.findIndex((p) => p.id === idOrPlant);
    } else {
      i = this.garden.plants.indexOf(idOrPlant);
    }

    if (i !== -1) {
      this.garden.plants.splice(i, 1);
    }
  }

  setTool(tool: Tool): void {
    if (this.garden) {
      this.clearTool();

      this.tool = tool;

      this.tool.Start();
    }
  }

  updateTool(x: number, y: number) {
    if (this.tool && this.garden) {
      this.tool.OnCursorMove(x, y);
    }
  }

  clearTool(): void {
    if (this.tool) {
      if (this.garden) {
        this.tool?.Stop();
      }

      this.tool = undefined;
    }
  }

  keyListener(event: KeyboardEvent): void {
    if (event.key === "Escape" && this.tool) {
      this.clearTool();
    }
  }
}

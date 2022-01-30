import { Family } from "@/entity/Family";

import "./apiRequest";
import { varietyApi } from "@/api/VarietyApi";
import { Variety } from "@/entity/Variety";
import { gardenApi } from "@/api/GardenApi";
import { Garden } from "@/entity/Garden";
import { Tool } from "./tools/Tool";
import { Action } from "./actions/Action";
import { Plant } from "@/entity/Plant";
import { Delaunay } from "d3-delaunay";
import { geoIdentity, geoPath } from "d3-geo";
import { familyApi } from "@/api/FamilyApi";
import { Planting } from "@/entity/Planting";
import { EntityBase } from "@/entity/EntityBase";

export type ElementType = "plant" | "bed" | "planting";

export default class Store {
  static _state: Store;

  static get state(): Store {
    if (!Store._state) {
      Store._state = new Store();
    }
    return Store._state;
  }

  // TODO: We assume data is stored in inches relative to garden origin.
  projection = geoIdentity().reflectY(true);

  pathGenerator = geoPath(this.projection);

  delaunay?: Delaunay<unknown>;

  drawer = false;

  loading = false;
  error = "";
  scale = 1;

  garden?: Garden = undefined;
  families: Family[] = [];
  varieties: Variety[] = [];

  actions: Action[] = [];

  toolName = "";
  tool: Tool | null = null;

  cursor?: d3.Selection<SVGGElement, unknown, null, undefined>;

  ready: Promise<void>;

  get scaleRange() {
    if (this.scale > 10) {
      return 3;
    } else if (this.scale > 2) {
      return 2;
    } else {
      return 1;
    }
  }

  public constructor() {
    this.ready = this.initialize();
  }

  async initialize(): Promise<void> {
    await this.loadGarden();
  }

  async loadGarden(): Promise<void> {
    this.error = "";
    this.loading = true;

    await this.loadVarieties();

    try {
      const garden = await gardenApi.one.request({ routeParams: { id: 1 } });

      garden.plants.forEach((p) => this.inflatePlant(p));

      garden.plantings.forEach((p) => this.inflatePlanting(p));

      this.garden = garden;

      this.updateDelaunay();
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

      this.families = await varietyApi.allByFamily.request();

      const symbols = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );

      let content = "";

      this.families.forEach((f) => {
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

  onClick(x: number, y: number, element?: EntityBase): void {
    if (this.tool && this.garden) {
      const action = this.tool.OnClick(x, y, element);

      if (action) {
        action.Do(this);

        this.actions.push(action);
      }
    }
  }

  async editVariety(item: Variety): Promise<void> {
    if (item.id) {
      const index = this.varieties.findIndex((v) => v.id === item.id);

      if (index === -1) {
        throw new Error(
          `Could not find matching variety id to edit: ${item.id}`
        );
      }

      Object.assign(this.varieties[index], item);

      await varietyApi.update.request({
        routeParams: { id: item.id },
        data: Variety.cleanCopy(item),
      });
    } else {
      const newVariety = await varietyApi.create.request({
        data: Variety.cleanCopy(item),
      });

      this.varieties.push(newVariety);

      const family = this.families.find(
        (f) => f.id === item.familyId ?? item.family?.id
      );

      if (family) {
        newVariety.family = family;
        family.varieties.push(newVariety);
      } else {
        throw new Error(`Could not find family for new variety: ${item.id}`);
      }
    }
  }

  async deleteVariety(item: Variety): Promise<void> {
    if (item.id == undefined) {
      throw new Error("No id on item to delete");
    }

    let index = this.varieties.findIndex((v) => v.id === item.id);

    if (index === -1) {
      throw new Error(
        `Could not find matching variety id to delete: ${item.id}`
      );
    }

    this.varieties.splice(index, 1);

    let family = item.family;

    if (!family) {
      family = this.families.find((f) => f.id === item.familyId);
    }

    if (!family) {
      throw new Error(`Could not find family for variety: ${item.id}.`);
    }

    index = family.varieties.findIndex((v) => v.id === item.id);

    if (index === -1) {
      throw new Error(
        `Could not find matching variety id in variety's family: ${item.id}`
      );
    }

    family.varieties.splice(index, 1);

    await varietyApi.delete.request({ routeParams: { id: item.id } });
  }

  async editFamily(item: Family): Promise<void> {
    if (item.id) {
      const index = this.families.findIndex((v) => v.id === item.id);

      if (index === -1) {
        throw new Error(
          `Could not find matching family id to edit: ${item.id}`
        );
      }

      Object.assign(this.families[index], item);

      const newFamily: Partial<Family> & { id: number } =
        Family.cleanCopy(item);

      delete newFamily.varieties;

      await familyApi.update.request({
        routeParams: { id: item.id },
        data: newFamily,
      });
    } else {
      const newFamily = await familyApi.create.request({
        data: Family.cleanCopy(item),
      });

      this.families.push(newFamily);
    }
  }

  async deleteFamily(item: Family): Promise<void> {
    if (item.id == undefined) {
      throw new Error("No id on item to delete");
    }

    if (
      item.varieties?.length ||
      this.varieties.some((v) => v.familyId === item.id)
    ) {
      throw new Error("Can't delete family with varieties.");
    }

    const index = this.families.findIndex((v) => v.id === item.id);

    if (index === -1) {
      throw new Error(
        `Could not find matching family id to delete: ${item.id}`
      );
    }

    this.families.splice(index, 1);

    await familyApi.delete.request({ routeParams: { id: item.id } });
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

  inflatePlanting(planting: Planting): Planting {
    if (planting.varietyId !== undefined) {
      planting.variety = this.varieties.find(
        (v) => v.id === planting.varietyId
      );
    }

    if (planting.gardenId === this.garden?.id) {
      planting.garden === this.garden;
    }

    return planting;
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

      this.updateDelaunay();
    }
  }

  removePlanting(id: number): void;
  removePlanting(planting: Planting): void;
  removePlanting(idOrPlanting: Planting | number): void {
    if (!this.garden) {
      return;
    }

    let i;

    if (typeof idOrPlanting === "number") {
      i = this.garden.plantings.findIndex((p) => p.id === idOrPlanting);
    } else {
      i = this.garden.plantings.indexOf(idOrPlanting);
    }

    if (i !== -1) {
      this.garden.plantings.splice(i, 1);
    }
  }

  updateDelaunay(): void {
    if (this.garden?.plants.length) {
      this.delaunay = new Delaunay(
        this.garden.plants.flatMap((p) => p.location.coordinates)
      );
    } else {
      delete this.delaunay;
    }
  }

  setTool(tool: Tool): void {
    if (this.garden) {
      this.clearTool();

      tool.Start();

      this.tool = tool;
    }
  }

  updateTool(cursor: [number, number]) {
    if (this.tool && this.garden) {
      const point = this.projection.invert(cursor);

      if (point) {
        this.tool.OnCursorMove(...point);
      }
    }
  }

  clearTool(): void {
    if (this.tool) {
      if (this.garden) {
        this.tool?.Stop();
      }

      this.tool = null;

      this.toolName = "";
    }
  }

  makeTransform(coordinate: [number, number]): string {
    return `translate(${this.projection(coordinate)?.join(" ")})`;
  }

  keyListener(event: KeyboardEvent): void {
    if (event.key === "Escape" && this.tool) {
      this.clearTool();
    }
  }
}

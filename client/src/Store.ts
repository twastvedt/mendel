import {
  gardenApi,
  Variety,
  Family,
  varietyApi,
  Garden,
  Plant,
  familyApi,
  Planting,
  EntityId,
  Position,
} from "@mendel/common";
import { Tool } from "./tools/Tool";
import { Action } from "./actions/Action";
import { Delaunay } from "d3-delaunay";
import { geoIdentity, geoPath } from "d3-geo";
import { PolygonGrid } from "./services/polygonGrid";

export type ElementType = "plant" | "bed" | "planting" | "area";

export class Store {
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

  cursorPosition = [0, 0] as Position;

  ready: Promise<void>;

  grid = null as PolygonGrid | null;

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

    addEventListener("keyup", (event) => {
      if (event.key === "Escape" && this.tool) {
        this.clearTool();

        this.toolName = "";
      }
    });
  }

  async initialize(): Promise<void> {
    await this.loadGarden();
  }

  async loadGarden(): Promise<void> {
    this.loading = true;

    await this.loadVarieties();

    const garden = await gardenApi.one.request({ routeParams: { id: 1 } });

    this.garden = garden;

    garden.plantings.forEach((p) => this.inflatePlanting(p));

    garden.plants.forEach((p) => this.inflatePlant(p));

    this.updateDelaunay();

    this.grid = new PolygonGrid(
      garden.beds.map((b) => b.shape.coordinates[0]),
      6
    );

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

        f.varieties?.forEach((v) => {
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

  onClick(element?: unknown): void {
    if (this.tool && this.garden) {
      const action = this.tool.onClick(this.cursorPosition, element);

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
        data: Variety.cleanCopy(item) as EntityId<Variety>,
      });
    } else {
      const newVariety = (await varietyApi.create.request({
        data: Variety.cleanCopy(item),
      })) as Variety;

      this.varieties.push(newVariety);

      const family = this.families.find(
        (f) => f.id === item.familyId ?? item.family?.id
      );

      if (family) {
        newVariety.family = family;
        (family.varieties ??= []).push(newVariety);
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

    if (family.varieties) {
      index = family.varieties.findIndex((v) => v.id === item.id);

      if (index === -1) {
        throw new Error(
          `Could not find matching variety id in variety's family: ${item.id}`
        );
      }

      family.varieties.splice(index, 1);
    }

    await varietyApi.delete.request({ routeParams: { id: item.id } });
  }

  async editFamily(item: Family): Promise<void> {
    if (item.id !== undefined) {
      const index = this.families.findIndex((v) => v.id === item.id);

      if (index === -1) {
        throw new Error(
          `Could not find matching family id to edit: ${item.id}`
        );
      }

      Object.assign(this.families[index], item);

      const newFamily = Family.cleanCopy(item);

      await familyApi.update.request({
        data: newFamily as EntityId<Family>,
      });
    } else {
      const newFamily = (await familyApi.create.request({
        data: Family.cleanCopy(item),
      })) as Family;

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

  addPlant(plant: Plant): void {
    this.inflatePlant(plant);

    this.garden?.plants.push(plant);
  }

  addPlanting(planting: Planting): void {
    this.inflatePlanting(planting);

    this.garden?.plantings.push(planting);
  }

  inflatePlant(plant: Plant): Plant {
    if (plant.varietyId !== undefined) {
      plant.variety = this.varieties.find((v) => v.id === plant.varietyId);
    }

    if (plant.gardenId === this.garden?.id) {
      plant.garden = this.garden;
    }

    if (plant.plantingId !== undefined) {
      const planting = this.garden?.plantings.find(
        (p) => p.id === plant.plantingId
      );

      if (planting) {
        plant.planting = planting;

        planting.plants ??= [];

        planting.plants.push(plant);
      }
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
      i = this.garden.plants.findIndex((p) => p.id === idOrPlant.id);
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

    let planting;
    let i;

    if (typeof idOrPlanting === "number") {
      i = this.garden.plantings.findIndex((p) => p.id === idOrPlanting);
      planting = this.garden.plantings[i];
    } else {
      planting = idOrPlanting;
      i = this.garden.plantings.findIndex((p) => p.id === idOrPlanting.id);
    }

    if (i !== -1) {
      this.garden.plantings.splice(i, 1);

      planting.plants?.forEach((p) => this.removePlant(p));
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
    this.clearTool();

    tool.start?.();

    this.tool = tool;
  }

  updateTool(cursor: Position) {
    if (this.tool) {
      this.tool.onCursorMove?.(cursor);
    }
  }

  clearTool(): void {
    if (this.tool) {
      this.tool?.stop?.();

      this.tool = null;
    }
  }

  makeTransform(coordinate: Position): string {
    return `translate(${this.projection(coordinate)?.join(" ")})`;
  }

  pathFromPoints(coordinates: Position[]): string | null {
    return this.pathGenerator({ type: "LineString", coordinates });
  }
}

export const state = new Store();
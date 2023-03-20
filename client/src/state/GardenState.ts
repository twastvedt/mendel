import {
  Family,
  familyApi,
  Garden,
  plantApi,
  Planting,
  plantingApi,
  Variety,
  varietyApi,
} from "@mendel/common/src";
import type { EntityId, Position } from "@mendel/common";
import { Plant } from "@mendel/common/src/entity/Plant";
import { Delaunay } from "d3-delaunay";
import { PolygonGrid } from "../services/polygonGrid";

export class GardenState {
  delaunayPoints: Plant[];

  delaunay?: Delaunay<Plant>;

  grid: PolygonGrid;

  varieties: Variety[] = [];

  constructor(public garden: Garden, public families: Family[]) {
    this.varieties = [];

    const symbols = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    let content = "";

    families
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((f) => {
        content += f.icon.replace("symbol ", `symbol id="family-${f.id}" `);

        f.varieties
          ?.slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach((v) => {
            v.family = f;
            this.varieties.push(v);
          });
      });

    symbols.innerHTML = content;
    symbols.setAttribute("display", "none");

    document.body.prepend(symbols);

    this.delaunayPoints = [];

    garden.plantings.forEach((planting) => {
      this.inflatePlanting(planting);

      if (planting.plants) {
        planting.plants.forEach((p) => {
          this.delaunayPoints.push(this.inflatePlant(p));
        });
      }
    });

    this.renewDelaunay();

    this.grid = new PolygonGrid(
      garden.beds.map((b) => b.shape.coordinates[0]),
      6
    );
  }

  async addPlant(
    location: Position,
    varietyId: number
  ): Promise<EntityId<Plant>> {
    let planting = this.garden.plantings.find((p) => p.varietyId === varietyId);

    if (!planting) {
      const newPlanting = new Planting();
      newPlanting.varietyId = varietyId;
      newPlanting.gardenId = this.garden.id;

      planting = await this.addPlanting(newPlanting);
    }

    if (planting.id === undefined) {
      throw new Error("Can't add plant to unsaved planting!");
    }

    const plant = new Plant();
    plant.location = { type: "Point", coordinates: location };
    plant.plantingId = planting.id;
    plant.planting = planting;

    if (planting.plants) {
      planting.plants.push(plant);
    } else {
      planting.plants = [plant];
    }

    const newPlant = (await plantApi.create.request({
      data: Plant.cleanCopy(plant),
    })) as EntityId<Plant>;

    Object.assign(plant, newPlant);

    this.delaunayPoints.push(plant);

    this.renewDelaunay();

    return plant as EntityId<Plant>;
  }

  async editPlant(id: number, changes: Partial<Plant>): Promise<void> {
    await plantApi.update.request({ data: { ...changes, id } });
  }

  inflatePlant(plant: Plant): Plant {
    if (!plant.planting) {
      plant.planting = this.garden.plantings.find(
        (p) => p.id === plant.plantingId
      );
    }

    return plant;
  }

  inflatePlanting(planting: Planting): Planting {
    if (planting.varietyId !== undefined) {
      planting.variety = this.varieties.find(
        (v) => v.id === planting.varietyId
      );
    }

    planting.gardenId = this.garden.id;
    planting.garden = this.garden;

    return planting;
  }

  async addPlanting(planting: Planting): Promise<EntityId<Planting>> {
    this.inflatePlanting(planting);

    this.garden?.plantings.push(planting);

    const newPlanting = (await plantingApi.create.request({
      data: Planting.cleanCopy(planting),
    })) as EntityId<Planting>;

    Object.assign(planting, newPlanting);

    if (planting.plants) {
      planting.plants.forEach((p) => {
        p.plantingId = newPlanting.id;
        this.delaunayPoints.push(p);
      });

      this.renewDelaunay();
    }

    return planting as EntityId<Planting>;
  }

  async removePlant(plant: EntityId<Plant>): Promise<void> {
    await plantApi.delete.request({
      routeParams: {
        id: plant.id,
      },
    });

    let planting = plant.planting;

    if (!planting) {
      planting = this.garden.plantings.find((p) => p.id === plant.id);
    }

    if (planting?.plants) {
      const plantIndex = planting.plants.findIndex((p) => p.id === plant.id);

      if (plantIndex !== -1) {
        planting.plants.splice(plantIndex, 1);
      }
    }

    const index = this.delaunayPoints.findIndex((p) => p.id === plant.id);

    if (index !== -1) {
      this.delaunayPoints.splice(index, 1);
      this.renewDelaunay();
    }
  }

  renewDelaunay(): void {
    if (this.delaunayPoints.length) {
      this.delaunay = Delaunay.from(
        this.delaunayPoints,
        (p) => p.location.coordinates[0],
        (p) => p.location.coordinates[1]
      );
    } else {
      delete this.delaunay;
    }
  }

  async removePlanting(id: number): Promise<void>;
  async removePlanting(planting: Planting): Promise<void>;
  async removePlanting(idOrPlanting: Planting | number): Promise<void> {
    let i;

    if (typeof idOrPlanting === "number") {
      i = this.garden.plantings.findIndex((p) => p.id === idOrPlanting);
    } else {
      i = this.garden.plantings.findIndex((p) => p.id === idOrPlanting.id);
    }

    if (i !== -1) {
      const planting = this.garden.plantings[i];

      if (planting.plants) {
        planting.plants.forEach((plant) => {
          const delaunayIndex = this.delaunayPoints.indexOf(plant);

          this.delaunayPoints.splice(delaunayIndex, 1);
        });

        this.renewDelaunay();
      }

      if (planting.id !== undefined) {
        await plantingApi.delete.request({ routeParams: { id: planting.id } });
      }

      this.garden.plantings.splice(i, 1);
    }
  }

  plantCount(options?: { varietyId?: number; familyId?: number }): number {
    let plantings: Planting[];

    if (options?.varietyId !== undefined) {
      plantings = this.garden.plantings.filter(
        (p) => p.varietyId === options.varietyId
      );
    } else if (options?.familyId !== undefined) {
      plantings = this.garden.plantings.filter(
        (p) => p.variety?.familyId === options.familyId
      );
    } else {
      plantings = this.garden.plantings;
    }

    return plantings.reduce((t, p) => t + (p.plants?.length ?? 0), 0);
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
}

import {
  EntityId,
  Family,
  familyApi,
  Garden,
  Planting,
  plantingApi,
  Position,
  Variety,
  varietyApi,
} from "@mendel/common";
import { Delaunay } from "d3-delaunay";
import { PolygonGrid } from "./services/polygonGrid";

interface DelaunayPoint {
  point: Position;
  planting: Planting;
}

export class GardenState {
  /**
   * Keys are planting ids, values are arrays of delaunay indeces matching planting's list of plants.
   */
  private plantToDelaunay = new Map<number, DelaunayPoint[]>();

  delaunayPoints: DelaunayPoint[];

  delaunay: Delaunay<DelaunayPoint>;

  grid: PolygonGrid;

  varieties: Variety[] = [];

  constructor(public garden: Garden, public families: Family[]) {
    this.varieties = [];

    const symbols = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    let content = "";

    families.forEach((f) => {
      content += f.icon.replace("symbol ", `symbol id="family-${f.id}" `);

      f.varieties?.forEach((v) => {
        v.family = f;
        this.varieties.push(v);
      });
    });

    symbols.innerHTML = content;
    symbols.setAttribute("display", "none");

    document.body.prepend(symbols);

    const delaunayPoints: DelaunayPoint[] = [];

    garden.plantings.forEach((planting) => {
      this.inflatePlanting(planting);

      if (planting.id !== undefined) {
        const plantingDelaunayPoints: DelaunayPoint[] = [];

        planting.locations.coordinates.forEach((point) => {
          const delaunayPoint = { planting, point };
          delaunayPoints.push(delaunayPoint);
          plantingDelaunayPoints.push(delaunayPoint);
        });

        this.plantToDelaunay.set(planting.id, plantingDelaunayPoints);
      }
    });

    this.delaunay = Delaunay.from(
      delaunayPoints,
      (p) => p.point[0],
      (p) => p.point[1]
    );

    this.delaunayPoints = delaunayPoints;

    this.grid = new PolygonGrid(
      garden.beds.map((b) => b.shape.coordinates[0]),
      6
    );
  }

  async addPlant(
    location: Position,
    varietyId: number
  ): Promise<EntityId<Planting>> {
    let planting = this.garden.plantings.find((p) => p.varietyId === varietyId);

    if (planting?.id !== undefined) {
      await this.addPlantToPlanting(location, planting as EntityId<Planting>);
    } else {
      planting = new Planting();

      planting.varietyId = varietyId;
      planting.gardenId = this.garden.id;
      planting.locations.coordinates.push(location);

      await this.addPlanting(planting);
    }

    return planting as EntityId<Planting>;
  }

  async addPlantToPlanting(
    location: Position,
    planting: EntityId<Planting>
  ): Promise<void> {
    planting.locations.coordinates.push(location);

    const delaunayPoint: DelaunayPoint = { planting, point: location };

    const plantToDelaunay = this.plantToDelaunay.get(planting.id);

    if (plantToDelaunay) {
      plantToDelaunay.push(delaunayPoint);
    }

    this.delaunayPoints.push(delaunayPoint);

    this.updateDelaunay();

    await plantingApi.addPlant.request({
      data: [location],
      routeParams: { id: planting.id },
    });
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

    let plantToDelaunay = this.plantToDelaunay.get(newPlanting.id);

    if (!plantToDelaunay) {
      plantToDelaunay = [];
      this.plantToDelaunay.set(newPlanting.id, plantToDelaunay);
    }

    planting.locations.coordinates.forEach((point) => {
      const delaunayPoint: DelaunayPoint = { planting, point };

      plantToDelaunay?.push(delaunayPoint);

      this.delaunayPoints.push(delaunayPoint);
    });

    this.updateDelaunay();

    return planting as EntityId<Planting>;
  }

  async removePlant(
    planting: EntityId<Planting>,
    location: Position
  ): Promise<void> {
    const index = planting.locations.coordinates.findIndex(
      (c) => c[0] === location[0] && c[1] === location[1]
    );

    if (index !== -1) {
      planting.locations.coordinates.splice(index, 1);

      await plantingApi.update.request({
        data: planting,
      });
    } else {
      throw new Error(
        `Could not find existing plant at (${location.join(", ")}).`
      );
    }

    const delaunayPoints = this.plantToDelaunay.get(planting.id);

    if (delaunayPoints) {
      const delaunayPoint = delaunayPoints[index];

      const delaunayIndex = this.delaunayPoints.indexOf(delaunayPoint);

      this.delaunayPoints.splice(delaunayIndex, 1);
      delaunayPoints.splice(delaunayIndex, 1);
    }

    this.updateDelaunay();
  }

  updateDelaunay(): void {
    this.delaunay.points = this.delaunayPoints.flatMap((p) => p.point);
    this.delaunay.update();
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

      if (planting.id !== undefined) {
        await plantingApi.delete.request({ routeParams: { id: planting.id } });

        const delaunayPoints = this.plantToDelaunay.get(planting.id);

        delaunayPoints?.forEach((delaunayPoint) => {
          const delaunayIndex = this.delaunayPoints.indexOf(delaunayPoint);

          this.delaunayPoints.splice(delaunayIndex, 1);
          delaunayPoints.splice(delaunayIndex, 1);
        });

        this.updateDelaunay();

        this.plantToDelaunay.delete(planting.id);
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

    return plantings.reduce((t, p) => t + p.locations.coordinates.length, 0);
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

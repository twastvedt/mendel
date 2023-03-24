import {
  Family,
  familyApi,
  Garden,
  plantApi,
  Planting,
  plantingApi,
  Variety,
  gardenApi,
  varietyApi,
  Plan,
  planApi,
  VarietyLocal,
} from "@mendel/common/src";
import type {
  Position,
  PlanLocal,
  PlantLocal,
  PlantingLocal,
  Modify,
  HasId,
} from "@mendel/common";
import { Plant } from "@mendel/common/src/entity/Plant";
import { Delaunay } from "d3-delaunay";
import { PolygonGrid } from "../services/polygonGrid";
import { defineStore } from "pinia";
import { ref, shallowRef, markRaw } from "vue";
import { useRootStore } from "./rootStore";

export const useGardenStore = defineStore("garden", () => {
  const rootStore = useRootStore();

  const delaunayPoints = markRaw<PlantLocal[]>([]);
  const delaunay = shallowRef<Delaunay<Plant> | undefined>(undefined);
  const grid = shallowRef<PolygonGrid | undefined>(undefined);

  const varieties = ref<Variety[]>([]);
  const garden = ref<Garden>();
  const currentPlan = ref<Modify<Plan, { plantings: PlantingLocal[] }>>();
  const plans = ref<Plan[]>();
  const families = ref<Family[]>();

  const ready = initialize();

  async function initialize() {
    rootStore.loading = true;

    families.value = await varietyApi.allByFamily.request();
    garden.value = await gardenApi.one.request({ routeParams: { id: 1 } });
    plans.value = await planApi.all.request();
    currentPlan.value = plans.value.reduce((prev, curr) =>
      prev.updatedDate < curr.updatedDate ? prev : curr
    );

    varieties.value = [];

    const symbols = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    let content = "";

    families.value
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((f) => {
        content += f.icon.replace("symbol ", `symbol id="family-${f.id}" `);

        f.varieties
          ?.slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach((v) => {
            v.family = f;
            varieties.value.push(v);
          });
      });

    symbols.innerHTML = content;
    symbols.setAttribute("display", "none");

    document.body.prepend(symbols);

    delaunayPoints.length = 0;

    currentPlan.value.plantings.forEach((planting) => {
      inflatePlanting(planting);

      planting.plants.forEach((p) => {
        delaunayPoints.push(inflatePlant(p));
      });
    });

    renewDelaunay();

    grid.value = new PolygonGrid(
      garden.value.beds.map((b) => b.shape.coordinates[0]),
      6
    );

    rootStore.loading = false;
  }

  async function addPlan(plan: PlanLocal): Promise<Plan> {
    if (plan.garden) {
      plan.gardenId = plan.garden.id;
    } else if (plan.gardenId === undefined) {
      plan.gardenId = garden.value?.id;
    }

    const response = await planApi.create.request({
      data: Plan.localCopy(plan),
    });

    const newPlan = { ...plan, ...(response as Plan) };
    delete newPlan.garden;

    // TODO: Fix `as`.
    plans.value?.push(newPlan as Plan);

    return newPlan as Plan;
  }

  async function editPlan(id: number, changes: Partial<Plan>): Promise<void> {
    await planApi.update.request({ data: { ...changes, id } });
  }

  async function addPlant(
    location: Position,
    varietyId: number
  ): Promise<Plant> {
    if (!currentPlan.value) {
      throw new Error("No plan!");
    }

    let planting = currentPlan.value.plantings.find(
      (p) => p.varietyId === varietyId
    );

    if (!planting) {
      const newPlanting: PlantingLocal = {
        varietyId: varietyId,
        planId: currentPlan.value.id,
        plants: [],
      };

      planting = await addPlanting(newPlanting);
    }

    if (planting.id === undefined) {
      throw new Error("Can't add plant to unsaved planting!");
    }

    const plant: PlantLocal = {
      location: { type: "Point", coordinates: location },
      plantingId: planting.id,
    };

    if (planting.plants) {
      planting.plants.push(plant);
    } else {
      planting.plants = [plant];
    }

    const newPlant = (await plantApi.create.request({
      data: Plant.localCopy(plant),
    })) as Plant;

    Object.assign(plant, newPlant);

    delaunayPoints.push(plant);

    renewDelaunay();

    return plant as Plant;
  }

  async function editPlant(id: number, changes: Partial<Plant>): Promise<void> {
    await plantApi.update.request({ data: { ...changes, id } });
  }

  function inflatePlant(plant: PlantLocal): PlantLocal {
    if (!currentPlan.value) {
      throw new Error("No plan!");
    }

    if (!plant.planting) {
      plant.planting = currentPlan.value.plantings.find(
        (p) => p.id === plant.plantingId
      );
    }

    return plant;
  }

  function inflatePlanting(planting: PlantingLocal): Planting {
    if (!currentPlan.value) {
      throw new Error("No plan!");
    }

    if (planting.varietyId !== undefined) {
      planting.variety = varieties.value.find(
        (v) => v.id === planting.varietyId
      );
    }

    planting.planId = currentPlan.value.id;
    planting.plan = currentPlan.value;

    return planting as Planting;
  }

  async function addPlanting(planting: PlantingLocal): Promise<Planting> {
    if (!currentPlan.value) {
      throw new Error("No plan!");
    }

    inflatePlanting(planting);

    currentPlan.value.plantings.push(planting);

    const newPlanting = (await plantingApi.create.request({
      data: Planting.localCopy(planting),
    })) as Planting;

    Object.assign(planting, newPlanting);

    if (planting.plants) {
      planting.plants.forEach((p) => {
        p.plantingId = newPlanting.id;
        delaunayPoints.push(p);
      });

      renewDelaunay();
    }

    return planting as Planting;
  }

  async function removePlant(plant: HasId<PlantLocal>): Promise<void> {
    if (!currentPlan.value) {
      throw new Error("No plan!");
    }

    await plantApi.delete.request({
      routeParams: {
        id: plant.id,
      },
    });

    let planting = plant.planting;

    if (!planting) {
      planting = currentPlan.value.plantings.find((p) => p.id === plant.id);
    }

    if (planting?.plants) {
      const plantIndex = planting.plants.findIndex((p) => p.id === plant.id);

      if (plantIndex !== -1) {
        planting.plants.splice(plantIndex, 1);
      }
    }

    const index = delaunayPoints.findIndex((p) => p.id === plant.id);

    if (index !== -1) {
      delaunayPoints.splice(index, 1);
      renewDelaunay();
    }
  }

  function renewDelaunay(): void {
    if (delaunayPoints.length) {
      delaunay.value = Delaunay.from(
        delaunayPoints,
        (p) => p.location.coordinates[0],
        (p) => p.location.coordinates[1]
      );
    } else {
      delaunay.value = undefined;
    }
  }

  async function removePlanting(id: number): Promise<void>;
  async function removePlanting(planting: PlantingLocal): Promise<void>;
  async function removePlanting(
    idOrPlanting: PlantingLocal | number
  ): Promise<void> {
    if (!currentPlan.value) {
      throw new Error("No plan!");
    }

    let i;

    if (typeof idOrPlanting === "number") {
      i = currentPlan.value.plantings.findIndex((p) => p.id === idOrPlanting);
    } else {
      i = currentPlan.value.plantings.findIndex(
        (p) => p.id === idOrPlanting.id
      );
    }

    if (i !== undefined && i !== -1) {
      const planting = currentPlan.value.plantings[i];

      if (planting?.plants) {
        planting.plants.forEach((plant) => {
          const delaunayIndex = delaunayPoints.indexOf(plant);

          delaunayPoints.splice(delaunayIndex, 1);
        });

        renewDelaunay();
      }

      if (planting?.id !== undefined) {
        await plantingApi.delete.request({ routeParams: { id: planting.id } });
      }

      currentPlan.value.plantings.splice(i, 1);
    }
  }

  function plantCount(options?: {
    varietyId?: number;
    familyId?: number;
  }): number {
    if (!currentPlan.value) {
      throw new Error("No plan!");
    }

    let plantings: PlantingLocal[];

    if (options?.varietyId !== undefined) {
      plantings = currentPlan.value.plantings.filter(
        (p) => p.varietyId === options.varietyId
      );
    } else if (options?.familyId !== undefined) {
      plantings = currentPlan.value.plantings.filter(
        (p) => p.variety?.familyId === options.familyId
      );
    } else {
      plantings = currentPlan.value.plantings;
    }

    return plantings.reduce((t, p) => t + p.plants.length, 0);
  }

  async function editVariety(item: VarietyLocal): Promise<void> {
    if (!families.value) {
      throw new Error("No families!");
    }

    if (item.id) {
      const index = varieties.value.findIndex((v) => v.id === item.id);

      if (index === -1) {
        throw new Error(
          `Could not find matching variety id to edit: ${item.id}`
        );
      }

      Object.assign(varieties.value[index], item);

      await varietyApi.update.request({
        data: Variety.localCopy(item) as Variety,
      });
    } else {
      const newVariety = (await varietyApi.create.request({
        data: Variety.localCopy(item),
      })) as Variety;

      varieties.value.push(newVariety);

      const family = families.value.find(
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

  async function deleteVariety(item: VarietyLocal): Promise<void> {
    if (!families.value) {
      throw new Error("No families!");
    }

    if (item.id == undefined) {
      throw new Error("No id on item to delete");
    }

    let index = varieties.value.findIndex((v) => v.id === item.id);

    if (index === -1) {
      throw new Error(
        `Could not find matching variety id to delete: ${item.id}`
      );
    }

    varieties.value.splice(index, 1);

    let family = item.family;

    if (!family) {
      family = families.value.find((f) => f.id === item.familyId);
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

  async function editFamily(item: Family): Promise<void> {
    if (!families.value) {
      throw new Error("No families!");
    }

    if (item.id !== undefined) {
      const index = families.value.findIndex((v) => v.id === item.id);

      if (index === -1) {
        throw new Error(
          `Could not find matching family id to edit: ${item.id}`
        );
      }

      Object.assign(families.value[index], item);

      const newFamily = Family.localCopy(item);

      await familyApi.update.request({
        data: newFamily as Family,
      });
    } else {
      const newFamily = (await familyApi.create.request({
        data: Family.localCopy(item),
      })) as Family;

      families.value.push(newFamily);
    }
  }

  async function deleteFamily(item: Family): Promise<void> {
    if (!families.value) {
      throw new Error("No families!");
    }

    if (item.id == undefined) {
      throw new Error("No id on item to delete");
    }

    if (
      item.varieties?.length ||
      varieties.value.some((v) => v.familyId === item.id)
    ) {
      throw new Error("Can't delete family with varieties.");
    }

    const index = families.value.findIndex((v) => v.id === item.id);

    if (index === -1) {
      throw new Error(
        `Could not find matching family id to delete: ${item.id}`
      );
    }

    families.value.splice(index, 1);

    await familyApi.delete.request({ routeParams: { id: item.id } });
  }

  return {
    ready,
    delaunayPoints,
    delaunay,
    grid,
    varieties,
    garden,
    currentPlan,
    plans,
    families,
    initialize,
    addPlan,
    editPlan,
    addPlant,
    editPlant,
    inflatePlant,
    inflatePlanting,
    addPlanting,
    removePlant,
    renewDelaunay,
    removePlanting,
    plantCount,
    editVariety,
    deleteVariety,
    editFamily,
    deleteFamily,
  };
});

import express from "express";
import { plantingApi, Planting } from "@mendel/common";
import { all, create, one, remove, update } from "./handlers";
import { addWrappedHandler } from "./addRoutes";

const router = express.Router();

addWrappedHandler(plantingApi.all, router, all(Planting));
addWrappedHandler(plantingApi.create, router, create(Planting));
addWrappedHandler(plantingApi.update, router, update(Planting));
addWrappedHandler(plantingApi.one, router, one(Planting));
addWrappedHandler(plantingApi.delete, router, remove(Planting));

addWrappedHandler(
  plantingApi.addPlant,
  router,
  Planting,
  async (request, repository) => {
    const planting = await repository.findOne(request.params.id);

    if (planting) {
      return (
        await repository.update(request.params.id, {
          locations: {
            coordinates: [...planting.locations.coordinates, ...request.body],
            type: "MultiPoint",
          },
        })
      ).generatedMaps[0] as Planting;
    }
  }
);

export default router;

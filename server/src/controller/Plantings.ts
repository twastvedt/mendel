import express from "express";
import { plantingApi, Planting } from "@mendel/common";
import { all, create, one, remove } from "./handlers";
import { addWrappedHandler } from "./addRoutes";

const router = express.Router();

addWrappedHandler(plantingApi.all, router, all(Planting));

addWrappedHandler(plantingApi.create, router, create(Planting));

addWrappedHandler(plantingApi.one, router, one(Planting));

addWrappedHandler(plantingApi.delete, router, remove(Planting));

addWrappedHandler(
  plantingApi.addPlant,
  router,
  Planting,
  async (request, repository) => {
    return (
      await repository.update(request.params.id, {
        locations: { coordinates: request.body },
      })
    ).generatedMaps[0] as Planting;
  }
);

export default router;

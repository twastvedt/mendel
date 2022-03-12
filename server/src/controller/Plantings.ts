import express from "express";
import { getManager } from "typeorm";
import { plantingApi, Planting, Plant } from "@mendel/common";
import { all, create, one, remove } from "./handlers";
import { addWrappedHandler } from "./addRoutes";

const router = express.Router();

addWrappedHandler(plantingApi.all, router, all(Planting));

addWrappedHandler(plantingApi.create, router, create(Planting));

addWrappedHandler(plantingApi.one, router, one(Planting));

addWrappedHandler(plantingApi.delete, router, remove(Planting));

addWrappedHandler(plantingApi.createWithPlants, router, async (request) => {
  const plantingRepo = getManager().getRepository(Planting);

  const planting = await plantingRepo.save(request.body);

  const plantRepo = getManager().getRepository(Plant);

  planting.plants.forEach((p) => {
    p.plantingId = planting.id;
    p.gardenId = planting.gardenId;
    p.plantDate = planting.plantDate;
    p.varietyId = planting.varietyId;
  });

  planting.plants = await plantRepo.save(planting.plants);

  return planting;
});

export default router;

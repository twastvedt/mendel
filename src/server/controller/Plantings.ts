import { plantingApi } from "../../api/PlantingApi";
import { Planting } from "../../entity/Planting";
import express from "express";

import { all, create, one, remove } from "./handlers";
import { getManager } from "typeorm";
import { Plant } from "@/entity/Plant";

const router = express.Router();

plantingApi.all.addWrappedHandler(router, all(Planting));

plantingApi.create.addWrappedHandler(router, create(Planting));

plantingApi.one.addWrappedHandler(router, one(Planting));

plantingApi.delete.addWrappedHandler(router, remove(Planting));

plantingApi.createWithPlants.addWrappedHandler(router, async (request) => {
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

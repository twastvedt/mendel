import { varietyApi } from "@/api/VarietyApi";
import { Variety } from "@/entity/Variety";
import express from "express";

import { one, all, create, update, remove } from "./handlers";

import { Family } from "@/entity/Family";

const router = express.Router();

varietyApi.allByFamily.addWrappedHandler(
  router,
  Family,
  async (request, repository) =>
    repository.find({
      relations: [nameof(Family.prototype.varieties)],
    })
);

varietyApi.all.addWrappedHandler(router, all(Variety));

varietyApi.create.addWrappedHandler(router, create(Variety));

varietyApi.one.addWrappedHandler(router, one(Variety));

varietyApi.update.addWrappedHandler(router, update(Variety));

varietyApi.delete.addWrappedHandler(router, remove(Variety));

export default router;

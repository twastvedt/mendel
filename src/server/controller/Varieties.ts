import { varietyApi } from "@/api/VarietyApi";
import { Variety } from "@/entity/Variety";
import express from "express";

import { addEndpoint, one, all, create } from "./handlers";

import { getManager } from "typeorm";
import { Family } from "@/entity/Family";

const router = express.Router();

addEndpoint(router, varietyApi.allByFamily, async (request, response) => {
  const repository = getManager().getRepository(Family);

  const result = await repository.find({
    relations: [nameof(Family.prototype.varieties)],
  });

  if (!result) {
    response.status(404);
    response.end();
    return;
  }

  response.send(result);
});

addEndpoint(router, varietyApi.all, all(Variety));

addEndpoint(router, varietyApi.create, create(Variety));

addEndpoint(router, varietyApi.one, one(Variety));

export default router;

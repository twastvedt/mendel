import { varietyApi } from "@/api/VarietyApi";
import { Variety } from "@/entity/Variety";
import express from "express";

import { addEndpoint } from "./addEndpoint";

import * as defaultEndpoints from "./defaultEndpoints";
import { getManager } from "typeorm";
import { Family } from "@/entity/Family";

const router = express.Router();

addEndpoint(router, varietyApi.one, defaultEndpoints.one(Variety));

addEndpoint(router, varietyApi.all, defaultEndpoints.all(Variety));

addEndpoint(router, varietyApi.create, defaultEndpoints.create(Variety));

addEndpoint(router, varietyApi.allWithFamilies, async (request, response) => {
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

export default router;

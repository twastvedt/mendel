import { bedApi } from "../../api/BedApi";
import { Bed } from "../../entity/Bed";
import express from "express";

import { addEndpoint, all, create, one, wrapHandler } from "./handlers";

const router = express.Router();

addEndpoint(router, bedApi.all, all(Bed));

addEndpoint(router, bedApi.create, create(Bed));

addEndpoint(router, bedApi.one, one(Bed));

addEndpoint(
  router,
  bedApi.garden,
  wrapHandler(
    Bed,
    bedApi.garden,
    async (request, repository) =>
      await repository.find({ where: { garden: request.params.garden } })
  )
);

export default router;

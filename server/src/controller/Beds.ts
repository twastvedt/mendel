import { bedApi, Bed } from "@mendel/common";
import express from "express";

import { all, create, one } from "./handlers";
import { addWrappedHandler } from "./addRoutes";
import { FindManyOptions } from "typeorm";

const router = express.Router();

addWrappedHandler(bedApi.all, router, all(Bed));

addWrappedHandler(bedApi.create, router, create(Bed));

addWrappedHandler(bedApi.one, router, one(Bed));

addWrappedHandler(bedApi.garden, router, Bed, (request, repository) => {
  // TODO: awaiting fix in https://github.com/typeorm/typeorm/pull/9709.
  const query = {
    where: { gardenId: request.params.gardenId },
  } as FindManyOptions<Bed>;
  return repository.find(query);
});

export default router;

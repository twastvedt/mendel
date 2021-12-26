import { bedApi } from "../../api/BedApi";
import { Bed } from "../../entity/Bed";
import express from "express";

import { all, create, one } from "./handlers";

const router = express.Router();

bedApi.all.addWrappedHandler(router, all(Bed));

bedApi.create.addWrappedHandler(router, create(Bed));

bedApi.one.addWrappedHandler(router, one(Bed));

bedApi.garden.addWrappedHandler(router, Bed, (request, repository) =>
  repository.find({ where: { garden: request.params.garden } })
);

export default router;

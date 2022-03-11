import { bedApi } from "../../../common/src/api/BedApi";
import { Bed } from "../../../common/src/entity/Bed";
import express from "express";

import { all, create, one } from "./handlers";
import { addWrappedHandler } from "./addRoutes";

const router = express.Router();

addWrappedHandler(bedApi.all, router, all(Bed));

addWrappedHandler(bedApi.create, router, create(Bed));

addWrappedHandler(bedApi.one, router, one(Bed));

addWrappedHandler(bedApi.garden, router, Bed, (request, repository) =>
  repository.find({ where: { garden: request.params.garden } })
);

export default router;

import { plantingApi } from "../../api/PlantingApi";
import { Planting } from "../../entity/Planting";
import express from "express";

import { all, create, one, remove } from "./handlers";

const router = express.Router();

plantingApi.all.addWrappedHandler(router, all(Planting));

plantingApi.create.addWrappedHandler(router, create(Planting));

plantingApi.one.addWrappedHandler(router, one(Planting));

plantingApi.delete.addWrappedHandler(router, remove(Planting));

export default router;

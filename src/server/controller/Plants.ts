import { plantApi } from "../../api/PlantApi";
import { Plant } from "../../entity/Plant";
import express from "express";

import { all, create, one, remove } from "./handlers";

const router = express.Router();

plantApi.all.addWrappedHandler(router, all(Plant));

plantApi.create.addWrappedHandler(router, create(Plant));

plantApi.one.addWrappedHandler(router, one(Plant));

plantApi.delete.addWrappedHandler(router, remove(Plant));

export default router;

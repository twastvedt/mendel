import { plantApi } from "../../api/PlantApi";
import { Plant } from "../../entity/Plant";
import express from "express";

import { all, create, one } from "./handlers";

const router = express.Router();

plantApi.all.addWrappedHandler(router, all(Plant));

plantApi.create.addWrappedHandler(router, create(Plant));

plantApi.one.addWrappedHandler(router, one(Plant));

export default router;

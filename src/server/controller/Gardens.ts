import express from "express";

import { all, create, one } from "./handlers";

import { gardenApi } from "@/api/GardenApi";
import { Garden } from "@/entity/Garden";

const router = express.Router();

gardenApi.all.addWrappedHandler(router, all(Garden));

gardenApi.create.addWrappedHandler(router, create(Garden));

gardenApi.one.addWrappedHandler(router, one(Garden));

export default router;

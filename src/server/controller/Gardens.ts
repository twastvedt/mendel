import express from "express";

import { addEndpoint, all, create, one } from "./handlers";

import { gardenApi } from "@/api/GardenApi";
import { Garden } from "@/entity/Garden";

const router = express.Router();

addEndpoint(router, gardenApi.all, all(Garden));

addEndpoint(router, gardenApi.create, create(Garden));

addEndpoint(router, gardenApi.one, one(Garden));

export default router;

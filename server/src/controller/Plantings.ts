import express from "express";
import { plantingApi, Planting } from "@mendel/common";
import { all, create, one, remove, update } from "./handlers.js";
import { addWrappedHandler } from "./addRoutes.js";

const router = express.Router();

addWrappedHandler(plantingApi.all, router, all(Planting));
addWrappedHandler(plantingApi.create, router, create(Planting));
addWrappedHandler(plantingApi.update, router, update(Planting));
addWrappedHandler(plantingApi.one, router, one(Planting));
addWrappedHandler(plantingApi.delete, router, remove(Planting));

export default router;

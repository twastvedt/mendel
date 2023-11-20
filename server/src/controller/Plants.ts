import express from "express";
import { plantApi, Plant } from "@mendel/common";
import { all, create, one, remove, update } from "./handlers.js";
import { addWrappedHandler } from "./addRoutes.js";

const router = express.Router();

addWrappedHandler(plantApi.all, router, all(Plant));
addWrappedHandler(plantApi.create, router, create(Plant));
addWrappedHandler(plantApi.update, router, update(Plant));
addWrappedHandler(plantApi.one, router, one(Plant));
addWrappedHandler(plantApi.delete, router, remove(Plant));

export default router;

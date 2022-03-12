import express from "express";
import { plantApi, Plant } from "@mendel/common";
import { all, create, one, remove } from "./handlers";
import { addWrappedHandler } from "./addRoutes";

const router = express.Router();

addWrappedHandler(plantApi.all, router, all(Plant));

addWrappedHandler(plantApi.create, router, create(Plant));

addWrappedHandler(plantApi.one, router, one(Plant));

addWrappedHandler(plantApi.delete, router, remove(Plant));

export default router;

import express from "express";
import { all, create, one } from "./handlers.js";
import { gardenApi, Garden } from "@mendel/common";
import { addWrappedHandler } from "./addRoutes.js";

const router = express.Router();

addWrappedHandler(gardenApi.all, router, all(Garden));

addWrappedHandler(gardenApi.create, router, create(Garden));

addWrappedHandler(gardenApi.one, router, one(Garden));

export default router;

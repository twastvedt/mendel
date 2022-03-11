import { familyApi, Family } from "@mendel/common";
import express from "express";
import { one, all, create, update, remove } from "./handlers";
import { addWrappedHandler } from "./addRoutes";

const router = express.Router();

addWrappedHandler(familyApi.all, router, all(Family));

addWrappedHandler(familyApi.create, router, create(Family));

addWrappedHandler(familyApi.one, router, one(Family));

addWrappedHandler(familyApi.update, router, update(Family));

addWrappedHandler(familyApi.delete, router, remove(Family));

export default router;

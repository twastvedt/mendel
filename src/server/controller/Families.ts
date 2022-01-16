import { familyApi } from "@/api/FamilyApi";
import express from "express";

import { one, all, create, update, remove } from "./handlers";

import { Family } from "@/entity/Family";

const router = express.Router();

familyApi.all.addWrappedHandler(router, all(Family));

familyApi.create.addWrappedHandler(router, create(Family));

familyApi.one.addWrappedHandler(router, one(Family));

familyApi.update.addWrappedHandler(router, update(Family));

familyApi.delete.addWrappedHandler(router, remove(Family));

export default router;

import express from "express";
import { varietyApi, Variety, Family } from "@mendel/common";
import { one, all, create, update, remove } from "./handlers.js";
import { addWrappedHandler } from "./addRoutes.js";

const router = express.Router();

addWrappedHandler(
  varietyApi.allByFamily,
  router,
  Family,
  async (request, repository) =>
    repository.find({
      relations: ["varieties"],
    }),
);

addWrappedHandler(varietyApi.all, router, all(Variety));

addWrappedHandler(varietyApi.create, router, create(Variety));

addWrappedHandler(varietyApi.one, router, one(Variety));

addWrappedHandler(varietyApi.update, router, update(Variety));

addWrappedHandler(varietyApi.delete, router, remove(Variety));

export default router;

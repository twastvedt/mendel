import express from "express";
import { planApi, Plan } from "@mendel/common";
import { all, create, one, remove, update } from "./handlers";
import { addWrappedHandler } from "./addRoutes";

const router = express.Router();

addWrappedHandler(
  planApi.lastEdited,
  router,
  Plan,
  async (request, repository) => {
    const plans = await repository.find({
      order: {
        updatedDate: "DESC",
      },
      take: 1,
    });
    return plans[0];
  }
);

addWrappedHandler(planApi.all, router, all(Plan));
addWrappedHandler(planApi.create, router, create(Plan));
addWrappedHandler(planApi.update, router, update(Plan));
addWrappedHandler(planApi.one, router, one(Plan));
addWrappedHandler(planApi.delete, router, remove(Plan));

export default router;

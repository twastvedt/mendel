import type { Plan, PlanLocal } from "../entity/Plan.js";
import { baseApi } from "./BaseApi.js";
import { Endpoint } from "./Endpoint.js";

export const planApi = Object.assign(baseApi<Plan, PlanLocal>("plans"), {
  lastEdited: new Endpoint<undefined, undefined, Plan>(
    "get",
    "/plans/lastEdited",
  ),
});

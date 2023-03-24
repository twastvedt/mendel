import { Plan, PlanLocal } from "../entity/Plan";
import { baseApi } from "./BaseApi";
import { Endpoint } from "./Endpoint";

export const planApi = Object.assign(baseApi<Plan, PlanLocal>("plans"), {
  lastEdited: new Endpoint<undefined, undefined, Plan>(
    "get",
    "/plans/lastEdited"
  ),
});

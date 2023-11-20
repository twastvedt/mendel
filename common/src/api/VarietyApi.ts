import type { Family } from "../entity/Family.js";
import type { Variety, VarietyLocal } from "../entity/Variety.js";
import { baseApi } from "./BaseApi.js";
import { Endpoint } from "./Endpoint.js";

export const varietyApi = Object.assign(
  baseApi<Variety, VarietyLocal>("varieties"),
  {
    allByFamily: new Endpoint<undefined, undefined, Family[]>(
      "get",
      "/varieties/allByFamily",
    ),
  },
);

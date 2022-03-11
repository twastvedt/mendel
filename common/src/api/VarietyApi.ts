import { Family } from "../entity/Family";
import { Variety } from "../entity/Variety";
import { baseApi } from "./BaseApi";
import { Endpoint } from "./Endpoint";

export const varietyApi = Object.assign(baseApi<Variety>("varieties"), {
  allByFamily: new Endpoint<undefined, undefined, Family[]>(
    "get",
    "/varieties/allByFamily"
  ),
});

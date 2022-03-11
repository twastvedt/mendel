import { Bed } from "../entity/Bed";
import { baseApi } from "./BaseApi";
import { Endpoint } from "./Endpoint";

export const bedApi = Object.assign(baseApi<Bed>("beds"), {
  garden: new Endpoint<{ garden: number }, undefined, Bed[]>(
    "get",
    "/gardens/:garden/beds"
  ),
});

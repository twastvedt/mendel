import { Bed, BedLocal } from "../entity/Bed";
import { baseApi } from "./BaseApi";
import { Endpoint } from "./Endpoint";

export const bedApi = Object.assign(baseApi<Bed, BedLocal>("beds"), {
  garden: new Endpoint<{ gardenId: number }, undefined, Bed[]>(
    "get",
    "/gardens/:gardenId/beds"
  ),
});

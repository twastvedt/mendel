import type { Bed, BedLocal } from "../entity/Bed.js";
import { baseApi } from "./BaseApi.js";
import { Endpoint } from "./Endpoint.js";

export const bedApi = Object.assign(baseApi<Bed, BedLocal>("beds"), {
  garden: new Endpoint<{ gardenId: number }, undefined, Bed[]>(
    "get",
    "/gardens/:gardenId/beds",
  ),
});

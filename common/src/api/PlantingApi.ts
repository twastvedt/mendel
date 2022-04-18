import { Position } from "../entity/geoJson";
import { Planting } from "../entity/Planting";
import { baseApi } from "./BaseApi";
import { Endpoint } from "./Endpoint";

export const plantingApi = Object.assign(baseApi<Planting>("plantings"), {
  addPlant: new Endpoint<{ id: number }, Position[], Planting | undefined>(
    "post",
    "/plantings/:id/add"
  ),
});

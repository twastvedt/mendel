import { Endpoint } from "@/api/Endpoint";
import { Planting } from "@/entity/Planting";
import { baseApi } from "./BaseApi";

export type PlantingWithPlants = Planting & Required<Pick<Planting, "plants">>;

export const plantingApi = Object.assign(baseApi<Planting>("plantings"), {
  createWithPlants: new Endpoint<
    PlantingWithPlants,
    PlantingWithPlants,
    undefined
  >("put", "/plantings/withPlants"),
});

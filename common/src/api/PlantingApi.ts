import { Endpoint } from "./Endpoint";
import { Planting } from "../entity/Planting";
import { baseApi } from "./BaseApi";

export type PlantingWithPlants = Planting & Required<Pick<Planting, "plants">>;

export const plantingApi = Object.assign(baseApi<Planting>("plantings"), {
  createWithPlants: new Endpoint<
    undefined,
    PlantingWithPlants,
    PlantingWithPlants
  >("put", "/plantings/withPlants"),
});

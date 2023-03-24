import { Planting, PlantingLocal } from "../entity/Planting";
import { baseApi } from "./BaseApi";

export const plantingApi = baseApi<Planting, PlantingLocal>("plantings");

import type { Planting, PlantingLocal } from "../entity/Planting.js";
import { baseApi } from "./BaseApi.js";

export const plantingApi = baseApi<Planting, PlantingLocal>("plantings");

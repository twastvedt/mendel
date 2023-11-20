import type { Plant, PlantLocal } from "../entity/Plant.js";
import { baseApi } from "./BaseApi.js";

export const plantApi = baseApi<Plant, PlantLocal>("plants");

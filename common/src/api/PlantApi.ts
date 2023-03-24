import { Plant, PlantLocal } from "../entity/Plant";
import { baseApi } from "./BaseApi";

export const plantApi = baseApi<Plant, PlantLocal>("plants");

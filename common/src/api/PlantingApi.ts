import { Planting } from "../entity/Planting";
import { baseApi } from "./BaseApi";

export const plantingApi = baseApi<Planting>("plantings");

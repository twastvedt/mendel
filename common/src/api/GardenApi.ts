import type { Garden, GardenLocal } from "../entity/Garden.js";
import { baseApi } from "./BaseApi.js";

export const gardenApi = baseApi<Garden, GardenLocal>("gardens");

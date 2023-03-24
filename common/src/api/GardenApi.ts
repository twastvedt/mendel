import { Garden, GardenLocal } from "../entity/Garden";
import { baseApi } from "./BaseApi";

export const gardenApi = baseApi<Garden, GardenLocal>("gardens");

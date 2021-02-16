import { Garden } from "@/entity/Garden";
import { baseApi } from "./BaseApi";

export const gardenApi = baseApi<Garden>("gardens");

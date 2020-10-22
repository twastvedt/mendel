import { Bed } from "@/entity/Bed";
import { baseApi } from "./BaseApi";

export const bedApi = baseApi<Bed>("beds");

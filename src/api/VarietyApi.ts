import { Variety } from "@/entity/Variety";
import { baseApi } from "./BaseApi";

export const varietyApi = baseApi<Variety>("varieties");

import { Plant } from "../entity/Plant";
import { baseApi } from "./BaseApi";

export const plantApi = baseApi<Plant>("plants");

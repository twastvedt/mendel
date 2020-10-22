import { Family } from "@/entity/Family";
import { baseApi } from "./BaseApi";

export const familyApi = baseApi<Family>("families");

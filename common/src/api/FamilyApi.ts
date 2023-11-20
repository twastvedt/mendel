import type { Family, FamilyLocal } from "../entity/Family.js";
import { baseApi } from "./BaseApi.js";

export const familyApi = baseApi<Family, FamilyLocal>("families");

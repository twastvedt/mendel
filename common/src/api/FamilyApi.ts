import { Family, FamilyLocal } from "../entity/Family";
import { baseApi } from "./BaseApi";

export const familyApi = baseApi<Family, FamilyLocal>("families");

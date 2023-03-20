import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import GardenMap from "../components/GardenMap.vue";
import VarietySettings from "../components/VarietySettings.vue";
import FamilySettings from "../components/FamilySettings.vue";
import Summary from "../components/Summary.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Map",
    component: GardenMap,
  },
  {
    path: "/settings",
    name: "Settings",
    component: FamilySettings,
  },
  {
    path: "/summary",
    name: "Summary",
    component: Summary,
  },
  {
    path: "/settings/families",
    name: "Families",
    component: FamilySettings,
  },

  {
    path: "/settings/varieties",
    name: "Varieties",
    component: VarietySettings,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import GardenMap from "../components/GardenMap.vue";
import VarietySettings from "../components/VarietySettings.vue";
import FamilySettings from "../components/FamilySettings.vue";
import MainMenu from "../components/MainMenu.vue";
import SettingsMenu from "../components/SettingsMenu.vue";
import Summary from "../components/Summary.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
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

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

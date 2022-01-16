import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import GardenMap from "../components/GardenMap.vue";
import VarietySettings from "../components/VarietySettings.vue";
import FamilySettings from "../components/FamilySettings.vue";
import MainMenu from "../components/MainMenu.vue";
import SettingsMenu from "../components/SettingsMenu.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Map",
    components: {
      default: GardenMap,
      navigation: MainMenu,
    },
  },
  {
    path: "/settings",
    name: "Settings",
    components: {
      default: FamilySettings,
      navigation: SettingsMenu,
    },
  },
  {
    path: "/settings/families",
    name: "Families",
    components: { default: FamilySettings, navigation: SettingsMenu },
  },

  {
    path: "/settings/varieties",
    name: "Varieties",
    components: { default: VarietySettings, navigation: SettingsMenu },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

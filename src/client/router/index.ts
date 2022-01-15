import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import GardenMap from "../components/GardenMap.vue";
import SettingsPage from "../components/SettingsPage.vue";
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
      default: SettingsPage,
      navigation: SettingsMenu,
    },
    children: [
      {
        path: "families",
        name: "Families",
        component: SettingsPage,
      },

      {
        path: "varieties",
        name: "Varieties",
        component: SettingsPage,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

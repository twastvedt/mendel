import { createApp } from "vue";
import { createPinia } from "pinia";
import "reflect-metadata";

import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";

import "./assets/style.css";

createApp(App).use(createPinia()).use(router).use(vuetify).mount("#app");

import Vue from "vue";
import Vuetify from "vuetify";
import App from "./App.vue";
import colors from "vuetify/lib/util/colors";
import router from "./router";
import "reflect-metadata";

Vue.use(Vuetify);

new Vue({
  el: "#app",
  render: (h) => h(App),
  router,
  vuetify: new Vuetify({
    theme: {
      themes: {
        light: {
          primary: colors.green,
          secondary: colors.brown,
          accent: colors.orange,
          error: colors.red,
        },
        dark: {
          primary: colors.green,
          secondary: colors.brown,
          accent: colors.orange,
          error: colors.red,
        },
      },
    },
  }),
});

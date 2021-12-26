import Vue from "vue";
import Vuetify from "vuetify";
import App from "./App.vue";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

new Vue({
  render: (h) => h(App),
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
}).$mount("#app");

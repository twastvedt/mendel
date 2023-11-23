import "vuetify/styles";
import { createVuetify } from "vuetify";
import colors from "vuetify/util/colors";

export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.green.base,
          secondary: colors.brown.base,
          accent: colors.orange.base,
          error: colors.red.base,
          mapBackground: colors.lime.lighten5,
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: colors.green.base,
          secondary: colors.brown.base,
          accent: colors.orange.base,
          error: colors.red.base,
          mapBackground: "rgb(37, 40, 31)",
        },
      },
    },
    defaultTheme: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  },
});

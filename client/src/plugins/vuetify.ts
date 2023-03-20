import "vuetify/styles";
import { createVuetify } from "vuetify";
import { VDataTable } from "vuetify/labs/VDataTable";
import colors from "vuetify/lib/util/colors";

export default createVuetify({
  components: {
    VDataTable,
  },
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.green,
          secondary: colors.brown,
          accent: colors.orange,
          error: colors.red,
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: colors.green,
          secondary: colors.brown,
          accent: colors.orange,
          error: colors.red,
        },
      },
    },
  },
});

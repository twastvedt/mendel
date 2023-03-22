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
          primary: colors.green.base,
          secondary: colors.brown.base,
          accent: colors.orange.base,
          error: colors.red.base,
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: colors.green.base,
          secondary: colors.brown.base,
          accent: colors.orange.base,
          error: colors.red.base,
        },
      },
    },
  },
});

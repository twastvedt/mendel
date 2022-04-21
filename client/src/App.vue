<template>
  <v-app>
    <toolbar />

    <v-navigation-drawer v-model="state.drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Mendel </v-list-item-title>
          <v-list-item-subtitle> Garden planner </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <mainMenu />
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <v-footer app>
      <template v-if="state.tool">
        {{ state.tool.helpText }}
      </template>
      <v-spacer />
      {{
        state.cursorPosition.map((c) => Math.round(c * 100) / 100).join(", ")
      }}
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import toolbar from "./components/Toolbar.vue";
import { state } from "./Store";
import mainMenu from "./components/MainMenu.vue";

export default defineComponent({
  name: "App",
  components: {
    toolbar,
    mainMenu,
  },
  setup() {
    return {
      state,
    };
  },
});
</script>

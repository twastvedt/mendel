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

      <MainMenu />
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
import { Component, Vue } from "vue-property-decorator";
import toolbar from "./components/Toolbar.vue";
import { state } from "./state/State";
import MainMenu from "./components/MainMenu.vue";

@Component({
  components: {
    toolbar,
    MainMenu,
  },
})
export default class App extends Vue {
  constructor() {
    super();
  }

  state = state;
}
</script>

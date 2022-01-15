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

      <router-view name="navigation" />
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import toolbar from "./components/Toolbar.vue";
import Store from "./Store";

@Component({
  components: {
    toolbar,
  },
})
export default class App extends Vue {
  constructor() {
    super();

    addEventListener("keyup", (event) => this.state.keyListener(event));
  }

  state = Store.state;
}
</script>

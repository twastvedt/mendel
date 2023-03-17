<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-app-bar-title> Mendel </v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
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
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { state } from "./state/State";
import MainMenu from "./components/MainMenu.vue";

export default defineComponent({
  name: "App",
  components: {
    MainMenu,
  },
  setup() {
    return {
      state,
      drawer: false
    };
  },
});
</script>

<script setup lang="ts">
import MainMenu from "./components/MainMenu.vue";
import { ref } from "vue";
import PlanMenu from "./components/PlanMenu.vue";

const drawer = ref(false);
</script>
<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-app-bar-title> Mendel </v-app-bar-title>
      <v-spacer />
      <PlanMenu />
      <v-spacer />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <MainMenu />
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

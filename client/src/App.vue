<script setup lang="ts">
import MainMenu from "./components/MainMenu.vue";
import { ref } from "vue";

const drawer = ref(false);
</script>
<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-app-bar-title> Mendel </v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list-item title="Mendel" subtitle="Garden planner" />

      <v-divider></v-divider>

      <MainMenu />
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

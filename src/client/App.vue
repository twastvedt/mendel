<template>
  <v-app>
    <v-main>
      <Map />
    </v-main>
    <v-navigation-drawer absolute permanent right>
      <Sidebar />
    </v-navigation-drawer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Map from "./components/Map.vue";
import Sidebar from "./components/Sidebar.vue";

@Component({
  components: {
    Map,
    Sidebar,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import "./styles/style.scss";
</style>

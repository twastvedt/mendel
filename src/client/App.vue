<template>
  <v-app>
    <v-main>
      <garden-map />
    </v-main>
    <v-navigation-drawer
      absolute
      permanent
      right
      app
      width="300px"
      class="brown"
    >
      <Sidebar />
    </v-navigation-drawer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import gardenMap from "./components/GardenMap.vue";
import Sidebar from "./components/Sidebar.vue";
import Store from "./Store";

@Component({
  components: {
    gardenMap,
    Sidebar,
  },
})
export default class App extends Vue {
  constructor() {
    super();
    Store.initialize();

    addEventListener("keyup", (event) => Store.state.keyListener(event));
  }
}
</script>

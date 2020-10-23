<template>
  <main>
    <Map />
  </main>
  <aside class="container">
    <Sidebar />
  </aside>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Map from "./components/Map.vue";
import Sidebar from "./components/Sidebar.vue";

@Options({
  components: {
    Map,
    Sidebar,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import "./styles/style.scss";

body {
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
  display: flex;
}

main {
  flex: 1 1 auto;
  height: 100%;
}

aside {
  height: 100%;
  flex: 0 0 400px;
}
</style>

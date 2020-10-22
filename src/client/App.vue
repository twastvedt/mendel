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
body {
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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

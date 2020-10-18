<template>
  <Map />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Map from "./components/Map.vue";

@Options({
  components: {
    Map,
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
}
</style>

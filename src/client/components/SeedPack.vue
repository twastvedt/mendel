<template class="container">
  <div class="seedPack">
    <h1>{{ variety.name }}</h1>
    <h2>{{ variety.family.name }}</h2>
    <div
      :style="`stroke: black; fill: ${variety.color}`"
      :v-html="variety.family.svg"
    ></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    variety: Object,
  },
})
export default class SeedPack extends Vue {}
</script>

<style scoped lang="scss">
@import "../styles/variables.scss";

.seedPack {
  width: 6em;
  height: 9em;
  margin: $s;
  background: white;
  flex: 0 0 auto;
}
</style>

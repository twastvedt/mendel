<template class="container">
  <div class="seedPack">
    <h1>{{ variety.name }}</h1>
    <h2>{{ variety.type.name }}</h2>
    <div
      :style="`stroke: black; fill: ${variety.color}`"
      :v-html="variety.type.svg"
    ></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { Variety } from "../../entity/Variety";

@Options({
  props: {
    variety: Variety,
  },
})
export default class SeedPack extends Vue {}
</script>

<style scoped lang="scss">
@import "../styles/style.scss";

.seedPack {
  width: 6em;
  height: 9em;
  margin: $s;
  background: white;
  flex: 0 0 auto;
}
</style>

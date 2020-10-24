<template class="container">
  <div class="seedPack">
    <h1>{{ variety.name }}</h1>
    <h2>{{ variety.family.name }}</h2>
    <div
      class="icon"
      :style="`fill: ${variety.color}`"
      v-html="variety.family.icon"
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
  display: flex;
  flex-direction: column;
  background: white;
  flex: 0 0 auto;
  padding: 0.25em;
}

h1 {
  margin: 0 0 0.25em 0;
  font-size: 1em;
  height: 2.5em;
  flex: 0 0 auto;
  border-bottom: 1px dashed #7d4e3f;
}

h2 {
  font-size: 0.6em;
  font-family: sans-serif;
  flex: 0 0 auto;
}

.icon {
  flex: 1 0 0;
  min-height: 0;
  stroke: black;
  text-align: center;

  &::v-deep svg {
    height: 100%;
  }
}
</style>

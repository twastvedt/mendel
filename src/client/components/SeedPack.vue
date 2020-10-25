<template>
  <v-card class="seedPack d-flex flex-column">
    <v-card-title>{{ variety.name }}</v-card-title>
    <v-card-subtitle>{{ variety.family.name }}</v-card-subtitle>
    <v-card-text
      class="icon flex-grow-1"
      :style="`fill: ${variety.color}`"
      v-html="variety.family.icon"
    ></v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  props: {
    variety: Object,
  },
})
export default class SeedPack extends Vue {}
</script>

<style scoped lang="scss">
@import "../styles/variables.scss";
.icon {
  min-height: 0;
  stroke: black;
  text-align: center;

  &::v-deep svg {
    height: 100%;
  }
}
</style>

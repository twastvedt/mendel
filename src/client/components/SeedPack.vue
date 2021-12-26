<template>
  <v-card class="seedPack d-flex flex-column">
    <v-card-title>{{ variety.name }}</v-card-title>
    <v-card-subtitle>{{ family.name }}</v-card-subtitle>
    <v-card-text
      class="icon flex-grow-1"
      :style="`fill: ${variety.color}`"
      v-html="family.icon"
    ></v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Family } from "@/entity/Family";
import { Variety } from "@/entity/Variety";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class SeedPack extends Vue {
  @Prop() variety!: Variety;

  get family(): Family {
    if (this.variety.family) {
      return this.variety.family;
    }

    throw new Error("Variety has no family");
  }
}
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

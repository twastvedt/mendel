<script setup lang="ts">
import { Family, Variety } from "@mendel/common";
import { computed } from "vue";

const props = defineProps<{
  variety: Variety;
}>();

const family = computed((): Family => {
  if (props.variety.family) {
    return props.variety.family;
  }

  throw new Error("Variety has no family");
});
</script>
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

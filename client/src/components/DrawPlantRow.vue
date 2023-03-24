<script setup lang="ts">
import type { Planting, Position } from "@mendel/common";
import PlantingComponent from "./PlantingComponent.vue";
import RotationTool from "./RotationTool.vue";

const props = defineProps<{
  planting: Planting;
  locations: Position[];
  cursor?: Position;
  rotationCenter?: Position;
}>();
</script>
<template>
  <g>
    <PlantingComponent
      :planting="props.planting"
      :locations="props.locations"
      :is-cursor="true"
      :plants-interactive="false"
    />

    <RotationTool
      :cursor="props.cursor"
      :rotation-center="props.rotationCenter"
    />
  </g>
</template>

<script setup lang="ts">
import type { Position } from "@mendel/common";
import { computed } from "vue";
import { projection } from "@/services/projection";

const props = defineProps<{
  cursor?: Position;
  rotationCenter?: Position;
}>();

const projectedRotationCenter = computed((): Position | null => {
  if (props.rotationCenter) {
    return projection(props.rotationCenter);
  }

  return null;
});

const projectedCursor = computed((): Position | null => {
  if (props.cursor) {
    return projection(props.cursor);
  }

  return null;
});
</script>
<template>
  <g v-if="projectedRotationCenter && projectedCursor">
    <line
      class="rotationLine"
      :x1="projectedRotationCenter[0]"
      :y1="projectedRotationCenter[1]"
      :x2="projectedCursor[0]"
      :y2="projectedCursor[1]"
    />

    <circle
      class="point"
      r="1"
      :cx="projectedRotationCenter[0]"
      :cy="projectedRotationCenter[1]"
    />
  </g>
</template>
<style scoped>
.rotationLine {
  stroke: black;
  stroke-width: 2px;
}

.point {
  stroke: black;
  fill: black;
  stroke-width: 2px;
}
</style>

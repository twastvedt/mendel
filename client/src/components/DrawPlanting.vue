<script setup lang="ts">
import type { Planting, Position } from "@mendel/common";
import PlantingComponent from "./PlantingComponent.vue";
import RotationTool from "./RotationTool.vue";
import type { GridPoints } from "../services/polygonGrid";
import { Stage } from "../tools/DrawPlantingTool";
import { computed } from "vue";
import * as projection from "@/services/projection";

const projectionTools = projection;

const props = defineProps<{
  planting: Planting;
  cursor?: Position;
  plants?: GridPoints;
  rotationCenter?: Position;
  dividingLine: Position[];
  stage: Stage;
  snapped: boolean;
}>();

const variety = computed(() => {
  if (props.planting.variety) {
    return props.planting.variety;
  }

  throw new Error("Planting has no variety");
});

const radius = computed(() => {
  const v = variety.value;
  if (v.family) {
    return v.family.spacing / 2;
  }

  return undefined;
});

const plantsClass = computed(() => ({
  faded:
    (props.stage === Stage.selecting && !!props.dividingLine[0]) ||
    props.stage === Stage.drawingLine,
}));

const projectedLineHead = computed(() =>
  props.dividingLine[0] && props.stage !== Stage.selectingAfterLine
    ? projectionTools.projection(props.dividingLine[0])
    : null,
);
</script>
<template>
  <g>
    <PlantingComponent
      :planting="planting"
      :is-cursor="true"
      :plants-interactive="false"
    />

    <g
      v-if="plants"
      :transform="projectionTools.makeTransform(plants.offset)"
      :class="plantsClass"
    >
      <circle
        v-for="(point, i) in plants.interiorPoints"
        :key="`interior${i}`"
        :fill="variety.color"
        :cx="point[0]"
        :cy="-point[1]"
        :r="radius"
        class="previewCircle"
      />
      <circle
        v-for="(p, i) in plants.edgePoints"
        v-show="p.display"
        :key="`exterior${i}`"
        :fill="variety.color"
        :cx="p.point[0]"
        :cy="-p.point[1]"
        :r="radius"
        class="previewCircle"
      />
    </g>

    <RotationTool :cursor="cursor" :rotation-center="rotationCenter" />

    <path
      v-if="dividingLine.length > 1"
      class="dividingLine"
      :d="projectionTools.pathFromPoints(dividingLine)"
    />

    <circle
      v-if="projectedLineHead"
      :class="['point', { snapped }]"
      r="1"
      :cx="projectedLineHead[0]"
      :cy="projectedLineHead[1]"
    />
  </g>
</template>

<style scoped>
g {
  pointer-events: none;
}

.previewCircle {
  fill-opacity: 0.2;
  stroke: gray;
  stroke-width: 1px;
}

.point {
  stroke: black;
  fill: black;
  stroke-width: 2px;

  &.snapped {
    fill: white;
  }
}

.dividingLine {
  stroke: black;
  stroke-width: 2px;
  fill: none;
}

.faded {
  opacity: 50%;
}
</style>

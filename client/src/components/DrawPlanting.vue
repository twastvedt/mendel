<script setup lang="ts">
import { Planting, Variety, Position } from "@mendel/common";
import { state } from "../Store";
import PlantingComponent from "./PlantingComponent.vue";
import PlantComponent from "./PlantComponent.vue";
import { GridPoints } from "../services/polygonGrid";
import { Stage } from "../tools/DrawPlantingTool";

const props = defineProps<{
  planting: Planting;
  cursor?: Position;
  plants?: GridPoints;
  rotationCenter?: Position;
  dividingLine: Position[];
  stage: Stage;
  snapped: boolean;
}>();

function variety(): Variety {
  if (props.planting.variety) {
    return props.planting.variety;
  }

  throw new Error("Planting has no variety");
}

function radius(): number | undefined {
  const v = variety();
  if (v.family) {
    return v.family.spacing / 2;
  }

  return undefined;
}

function projectedRotationCenter(): Position | null {
  if (props.rotationCenter) {
    return state.projection(props.rotationCenter);
  }

  return null;
}

function projectedCursor(): Position | null {
  if (props.cursor) {
    return state.projection(props.cursor);
  }

  return null;
}

function projectedLineHead(): Position | null {
  if (props.dividingLine[0] && props.stage !== Stage.selectingAfterLine) {
    return state.projection(props.dividingLine[0]);
  }

  return null;
}

function plantsClass(): Record<string, boolean> {
  return {
    faded:
      (props.stage === Stage.selecting && !!props.dividingLine[0]) ||
      props.stage === Stage.drawingLine,
  };
}
</script>
<template>
  <g>
    <PlantingComponent :planting="planting" :is-cursor="true" />

    <g
      v-if="plants"
      :transform="state.makeTransform(plants.offset)"
      :class="plantsClass"
    >
      <circle
        v-for="(point, i) in plants.interiorPoints"
        :key="`interior${i}`"
        :fill="variety().color"
        :cx="point[0]"
        :cy="-point[1]"
        :r="radius"
        class="previewCircle"
      />
      <circle
        v-for="(p, i) in plants.edgePoints"
        v-show="p.display"
        :key="`exterior${i}`"
        :fill="variety().color"
        :cx="p.point[0]"
        :cy="-p.point[1]"
        :r="radius"
        class="previewCircle"
      />
    </g>

    <template v-if="projectedRotationCenter && projectedCursor">
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
    </template>

    <path
      v-if="dividingLine.length > 1"
      class="dividingLine"
      :d="state.pathFromPoints(dividingLine) || undefined"
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

<style lang="scss" scoped>
g {
  pointer-events: none;
}

.previewCircle {
  fill-opacity: 0.2;
  stroke: gray;
  stroke-width: 1px;
}

.rotationLine {
  stroke: black;
  stroke-width: 2px;
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

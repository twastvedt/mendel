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

<script lang="ts">
import { Position } from "@mendel/common";
import { Component, Prop, Vue } from "vue-property-decorator";
import { state } from "../state/State";

@Component({})
export default class RotationTool extends Vue {
  @Prop() readonly cursor?: Position;
  @Prop() readonly rotationCenter?: Position;

  get projectedRotationCenter(): Position | null {
    if (this.rotationCenter) {
      return state.projection(this.rotationCenter);
    }

    return null;
  }

  get projectedCursor(): Position | null {
    if (this.cursor) {
      return state.projection(this.cursor);
    }

    return null;
  }
}
</script>
<style lang="scss" scoped>
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

<template>
  <g>
    <PlantingComponent
      :planting="planting"
      :is-cursor="true"
      :plants-interactive="false"
    />

    <g
      v-if="plants"
      :transform="state.makeTransform(plants.offset)"
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
      :d="state.pathFromPoints(dividingLine)"
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

<script lang="ts">
import { Planting, Variety, Position } from "@mendel/common";
import { Component, Prop, Vue } from "vue-property-decorator";
import { state } from "../state/State";
import PlantingComponent from "./PlantingComponent.vue";
import PlantComponent from "./PlantComponent.vue";
import { GridPoints } from "../services/polygonGrid";
import { Stage } from "../tools/DrawPlantingTool";
import RotationTool from "./RotationTool.vue";

@Component({
  components: {
    PlantingComponent,
    PlantComponent,
    RotationTool,
  },
})
export default class DrawPlanting extends Vue {
  @Prop() readonly planting!: Planting;
  @Prop() readonly cursor?: Position;
  @Prop() readonly plants?: GridPoints;
  @Prop() readonly rotationCenter?: Position;
  @Prop() readonly dividingLine!: Position[];
  @Prop() readonly stage!: Stage;
  @Prop() readonly snapped!: boolean;

  get radius(): number | undefined {
    if (this.variety.family) {
      return this.variety.family.spacing / 2;
    }

    return undefined;
  }

  get projectedLineHead(): Position | null {
    if (this.dividingLine[0] && this.stage !== Stage.selectingAfterLine) {
      return state.projection(this.dividingLine[0]);
    }

    return null;
  }

  get variety(): Variety {
    if (this.planting.variety) {
      return this.planting.variety;
    }

    throw new Error("Planting has no variety");
  }

  get plantsClass(): Record<string, boolean> {
    return {
      faded:
        (this.stage === Stage.selecting && !!this.dividingLine[0]) ||
        this.stage === Stage.drawingLine,
    };
  }

  state = state;
  Stage = Stage;
}
</script>
<style lang="scss" scoped>
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

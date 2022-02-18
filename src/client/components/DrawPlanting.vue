<template>
  <g>
    <PlantingComponent :planting="planting" :is-cursor="true" />

    <g v-if="plants" :transform="state.makeTransform(plants.offset)">
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

    <template v-if="projectedRotationCenter && projectedCursor">
      <line
        class="rotationLine"
        :x1="projectedRotationCenter[0]"
        :y1="projectedRotationCenter[1]"
        :x2="projectedCursor[0]"
        :y2="projectedCursor[1]"
      />

      <circle
        class="rotationCenter"
        r="1"
        :cx="projectedRotationCenter[0]"
        :cy="projectedRotationCenter[1]"
      />
    </template>
  </g>
</template>

<script lang="ts">
import { Planting } from "@/entity/Planting";
import { Component, Prop, Vue } from "vue-property-decorator";
import { state } from "../Store";
import { Variety } from "@/entity/Variety";
import PlantingComponent from "./PlantingComponent.vue";
import PlantComponent from "./PlantComponent.vue";
import { GridPoints } from "../services/polygonGrid";
import { Position } from "@/entity/geoJson";

@Component({
  components: {
    PlantingComponent,
    PlantComponent,
  },
})
export default class DrawPlanting extends Vue {
  @Prop() readonly planting!: Planting;
  @Prop() readonly cursor?: [number, number];
  @Prop() readonly plants?: GridPoints;
  @Prop() readonly rotationCenter?: [number, number];

  get radius(): number | undefined {
    if (this.variety.family) {
      return this.variety.family.spacing / 2;
    }

    return undefined;
  }

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

  get variety(): Variety {
    if (this.planting.variety) {
      return this.planting.variety;
    }

    throw new Error("Planting has no variety");
  }

  state = state;
}
</script>
<style scoped>
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

.rotationCenter {
  stroke: black;
  fill: white;
  stroke-width: 2px;
}
</style>

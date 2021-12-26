<template>
  <g v-if="state.scaleRange > 1">
    <use
      :width="iconSize"
      :height="iconSize"
      :x="-iconSize / 2"
      :y="-iconSize / 2"
      :href="`#family-${family.id}`"
      :fill="variety.color"
    />
    <circle :r="family.spacing" class="spacingCircle" />
  </g>
  <circle
    v-else
    :r="family.spacing"
    :fill="variety.color"
    class="solidCircle"
  />
</template>

<script lang="ts">
import { Plant } from "@/entity/Plant";
import { Component, Prop, Vue } from "vue-property-decorator";
import Store from "../Store";
import "reflect-metadata";
import { Family } from "@/entity/Family";
import { Variety } from "@/entity/Variety";

@Component({})
export default class PlantComponent extends Vue {
  @Prop() readonly plant!: Plant;

  get family(): Family {
    if (this.plant.variety?.family) {
      return this.plant.variety.family;
    }

    throw new Error("Plant has no family");
  }

  get variety(): Variety {
    if (this.plant.variety) {
      return this.plant.variety;
    }

    throw new Error("Plant has no variety");
  }

  get iconSize(): number {
    return Math.min(40 / this.state.scale, this.family.spacing);
  }

  state = Store.state;
}
</script>

<style scoped lang="scss">
.solidCircle {
}

.spacingCircle {
  fill: none;
  stroke: gray;
  stroke-dasharray: 5 5;
}
</style>

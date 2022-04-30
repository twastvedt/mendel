<template>
  <g :class="classList">
    <path
      v-if="planting.shape"
      ref="shape"
      :d="state.pathGenerator(planting.shape)"
      :fill="variety.color"
      class="shape"
      @click="$emit('click', $event)"
    />

    <PlantComponent
      v-if="
        !isCursor &&
        state.scaleRange > 1 &&
        !planting.locations.coordinates.length
      "
      :transform="labelTransform"
      :draw-spacing="false"
      :interactive="false"
      :variety="variety"
      class="icon"
    />
    <PlantComponent
      v-for="(location, i) in planting.locations.coordinates"
      :key="i"
      :variety="variety"
      :transform="state.makeTransform(location)"
    />
    <title>
      {{ variety.name }} <span v-if="variety.family">{{
        variety.family.name
      }}</span> <template v-if="planting.locations.coordinates.length"> <br/>
      &#xA;
      {{ planting.locations.coordinates.length }}
      </template>
    </title>
  </g>
</template>

<script lang="ts">
import { Planting, Variety } from "@mendel/common";
import { Component, Prop, Vue } from "vue-property-decorator";
import { state } from "../state/State";
import PlantComponent from "./PlantComponent.vue";
import polylabel from "polylabel";

@Component({
  components: {
    PlantComponent,
  },
})
export default class PlantingComponent extends Vue {
  @Prop() readonly planting!: Planting;
  @Prop({ default: false }) readonly isCursor!: boolean;

  get variety(): Variety {
    if (this.planting.variety) {
      return this.planting.variety;
    }

    throw new Error("Planting has no variety");
  }

  get classList(): Record<string, unknown> {
    return { cursor: this.isCursor };
  }

  get labelTransform(): string | undefined {
    if (this.planting.shape) {
      return state.makeTransform(
        polylabel(this.planting.shape.coordinates) as [number, number]
      );
    }

    return undefined;
  }

  state = state;
}
</script>

<style scoped lang="scss">
.shape {
  fill-opacity: 0.5;
  stroke: none;

  &:hover {
    fill-opacity: 0.3;
  }
}

.cursor .shape {
  fill-opacity: 0.7;
}

.cursor,
.icon {
  pointer-events: none;
}
</style>

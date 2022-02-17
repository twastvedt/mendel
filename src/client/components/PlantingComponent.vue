<template>
  <g :class="classList">
    <path
      ref="shape"
      :d="state.pathGenerator(planting.shape)"
      :fill="variety.color"
      class="shape"
      @click="$emit('click', $event)"
    />

    <PlantComponent
      v-if="!isCursor && state.scaleRange > 1 && !planting.plants"
      :transform="transform"
      :draw-spacing="false"
      :interactive="false"
      :variety="variety"
      class="icon"
    />
    <title v-html="title"></title>
  </g>
</template>

<script lang="ts">
import { Planting } from "@/entity/Planting";
import { Component, Prop, Vue } from "vue-property-decorator";
import { state } from "../Store";
import { Variety } from "@/entity/Variety";
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

  get title(): string {
    let title = `${this.variety.name} ${this.variety.family?.name}`;

    if (this.planting.plants?.length) {
      title += `<br>&#xA;${this.planting.plants?.length}`;
    } else if (this.planting.quantity != undefined) {
      title += `<br>&#xA;~${this.planting.quantity}`;
    }

    return title;
  }

  get classList(): Record<string, unknown> {
    return { cursor: this.isCursor };
  }

  get transform(): string {
    return state.makeTransform(
      polylabel(this.planting.shape.coordinates) as [number, number]
    );
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

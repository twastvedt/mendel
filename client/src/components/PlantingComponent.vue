<template>
  <g :class="classList">
    <path
      v-if="planting.shape"
      ref="shape"
      :d="state.pathGenerator(planting.shape)"
      :fill="variety.color"
      :stroke="variety.color"
      class="shape"
      @click="$emit('click', $event)"
    />

    <PlantComponent
      v-if="!isCursor && state.scaleRange > 1 && !plantLocations.length"
      :transform="labelTransform"
      :draw-spacing="false"
      :variety="variety"
      :interactive="false"
    />
    <template v-if="locations">
      <PlantComponent
        v-for="(position, i) in locations"
        :key="i"
        :variety="variety"
        :transform="state.makeTransform(position)"
        :interactive="false"
      />
    </template>
    <template v-if="planting.plants">
      <PlantComponent
        v-for="(plant, i) in planting.plants"
        :key="`plant-${i}`"
        :variety="variety"
        :transform="state.makeTransform(plant.location.coordinates)"
        :interactive="plantsInteractive"
        @click.stop="plantClick($event, plant)"
      />
    </template>
    <title>
      {{ variety.name }} <span v-if="variety.family">{{
        variety.family.name
      }}</span> <template v-if="plantLocations.length"> <br/> &#xA;
      {{ plantLocations.length }}
      </template>
    </title>
  </g>
</template>

<script lang="ts">
import { Planting, Position, Variety } from "@mendel/common";
import { Component, Prop, Vue } from "vue-property-decorator";
import { state } from "../state/State";
import { PlantElement } from "../types/entityTypes";
import PlantComponent from "./PlantComponent.vue";
import polylabel from "polylabel";
import { Plant } from "@mendel/common/dist/entity/Plant";

@Component({
  components: {
    PlantComponent,
  },
})
export default class PlantingComponent extends Vue {
  @Prop() readonly planting!: Planting;
  @Prop({ required: false }) readonly locations?: Position[];
  @Prop({ default: false }) readonly isCursor!: boolean;
  @Prop() readonly plantsInteractive!: boolean;

  state = state;

  get variety(): Variety {
    if (this.planting.variety) {
      return this.planting.variety;
    }

    throw new Error("Planting has no variety");
  }

  get classList(): (Record<string, unknown> | string | undefined)[] {
    return [this.planting.shape?.type, { cursor: this.isCursor }];
  }

  get labelTransform(): string | undefined {
    if (this.planting.shape) {
      if (this.planting.shape.type === "LineString") {
        const coordinates = this.planting.shape.coordinates;

        return state.makeTransform([
          (coordinates[1][0] + coordinates[0][0]) / 2,
          (coordinates[1][1] + coordinates[0][1]) / 2,
        ]);
      } else {
        return state.makeTransform(
          polylabel(this.planting.shape.coordinates) as [number, number]
        );
      }
    }

    return undefined;
  }

  get plantLocations(): Position[] {
    return (
      this.locations ??
      this.planting.plants?.map((p) => p.location.coordinates) ??
      []
    );
  }

  plantClick(event: PointerEvent, plant: Plant): void {
    state.onClick(event, {
      type: "plant",
      item: plant,
    } as PlantElement);
  }
}
</script>

<style scoped lang="scss">
.shape {
  opacity: 0.5;
  stroke-width: 10px;
  stroke-linecap: round;

  &:hover {
    opacity: 0.3;
  }
}

.Polygon .shape {
  stroke: none;
}

.LineString .shape {
  fill: none;
}

.cursor .shape {
  fill-opacity: 0.7;
}

.cursor {
  pointer-events: none;
}
</style>

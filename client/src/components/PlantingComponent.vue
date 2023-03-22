<script setup lang="ts">
import type { Planting, Position, Variety } from "@mendel/common";
import { useRootStore } from "../state/rootStore";
import type { PlantElement } from "../types/entityTypes";
import PlantComponent from "./PlantComponent.vue";
import polylabel from "polylabel";
import type { Plant } from "@mendel/common/dist/entity/Plant";
import { computed } from "vue";
import { pathGenerator, makeTransform } from "@/services/projection";

const pathGeneratorLocal = pathGenerator;
const makeTransformLocal = makeTransform;

const store = useRootStore();

const props = defineProps<{
  planting: Planting;
  locations?: Position[];
  isCursor?: boolean;
  plantsInteractive: boolean;
}>();

const variety = computed((): Variety => {
  if (props.planting.variety) {
    return props.planting.variety;
  }

  throw new Error("Planting has no variety");
});

const classList = computed(
  (): (Record<string, unknown> | string | undefined)[] => {
    return [{ cursor: props.isCursor }];
  }
);

const labelTransform = computed((): string | undefined => {
  if (props.planting.shape) {
    return makeTransform(
      polylabel([props.planting.shape.coordinates]) as [number, number]
    );
  }

  return undefined;
});

const plantLocations = computed((): Position[] => {
  return (
    props.locations ??
    props.planting.plants?.map((p) => p.location.coordinates) ??
    []
  );
});

function plantClick(event: PointerEvent, plant: Plant): void {
  store.onClick(event, {
    type: "plant",
    item: plant,
  } as PlantElement);
}
</script>

<template>
  <g :class="classList">
    <path
      v-if="planting.shape"
      ref="shape"
      :d="pathGeneratorLocal(planting.shape)"
      :fill="variety.color"
      :stroke="variety.color"
      class="shape"
      @click="$emit('click', $event)"
    />

    <PlantComponent
      v-if="!isCursor && store.scaleRange > 1 && !plantLocations.length"
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
        :transform="makeTransformLocal(position)"
        :interactive="false"
      />
    </template>
    <template v-if="planting.plants">
      <PlantComponent
        v-for="(plant, i) in planting.plants"
        :key="`plant-${i}`"
        :variety="variety"
        :transform="makeTransformLocal(plant.location.coordinates)"
        :interactive="plantsInteractive"
        @click.stop="plantClick($event, plant)"
      />
    </template>
    <title>
      {{ variety.name }} <span v-if="variety.family">{{
        variety.family?.name
      }}</span> <template v-if="plantLocations.length"> <br/> &#xA;
      {{ plantLocations.length }}
      </template>
    </title>
  </g>
</template>

<style scoped lang="scss">
.shape {
  opacity: 0.5;
  stroke: none;

  &:hover {
    opacity: 0.3;
  }
}

.cursor {
  pointer-events: none;

  .shape {
    fill-opacity: 0.7;
  }
}
</style>

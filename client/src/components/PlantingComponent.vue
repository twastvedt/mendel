<script setup lang="ts">
import type { PlantingLocal, Position, VarietyLocal } from "@mendel/common";
import { useRootStore } from "../state/rootStore";
import type { PlantElement } from "../types/entityTypes";
import PlantComponent from "./PlantComponent.vue";
import polylabel from "polylabel";
import type { PlantLocal } from "@mendel/common/dist/entity/Plant";
import { computed } from "vue";
import { pathGenerator, makeTransform } from "@/services/projection";

const pathGeneratorLocal = pathGenerator;
const makeTransformLocal = makeTransform;

const store = useRootStore();

const props = defineProps<{
  planting: PlantingLocal;
  locations?: Position[];
  isCursor?: boolean;
  plantsInteractive: boolean;
}>();

const variety = computed((): VarietyLocal => {
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
  const planting = props.planting;

  if (planting.shape) {
    if (planting.isArea) {
      return makeTransform(
        polylabel([planting.shape.coordinates]) as [number, number]
      );
    }

    const coordinates = planting.shape.coordinates;

    return makeTransform([
      (coordinates[1][0] + coordinates[0][0]) / 2,
      (coordinates[1][1] + coordinates[0][1]) / 2,
    ]);
  }

  return undefined;
});

const plantLocations = computed(
  (): Position[] =>
    props.locations ?? props.planting.plants.map((p) => p.location.coordinates)
);

const title = computed(() => {
  let text = variety.value.name;

  if (variety.value.family) {
    text += ` ${variety.value.family.name}`;
  }

  if (plantLocations.value.length) {
    text += `\n${plantLocations.value.length}`;
  }

  return text;
});

function plantClick(event: PointerEvent, plant: PlantLocal): void {
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
      :fill="planting.isArea ? variety.color : 'none'"
      :stroke="planting.isArea ? 'none' : variety.color"
      class="shape"
      @click="$emit('click', $event)"
    />

    <PlantComponent
      v-if="
        !isCursor &&
        store.scaleRange > 1 &&
        !plantLocations.length &&
        !planting.plants.length
      "
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
    <PlantComponent
      v-for="(plant, i) in planting.plants"
      :key="`plant-${i}`"
      :variety="variety"
      :transform="makeTransformLocal(plant.location.coordinates)"
      :interactive="plantsInteractive"
      @click.stop="plantClick($event, plant)"
    />
    <title>{{ title }}</title>
  </g>
</template>

<style scoped lang="scss">
.shape {
  opacity: 0.5;
  stroke-width: 10px;
  stroke-linecap: round;

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

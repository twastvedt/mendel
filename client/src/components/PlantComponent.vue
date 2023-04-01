<script setup lang="ts">
import { withDefaults, computed } from "vue";
import { useRootStore } from "../state/rootStore";
import type { VarietyLocal } from "@mendel/common";
import PlantIcon from "./PlantIcon.vue";

const store = useRootStore();

const props = withDefaults(
  defineProps<{
    variety: VarietyLocal;
    drawSpacing?: boolean;
    interactive?: boolean;
  }>(),
  {
    drawSpacing: true,
    interactive: true,
  }
);

const family = computed(() => {
  if (props.variety.family) {
    return props.variety.family;
  }

  throw new Error("Variety has no family");
});

const iconSize = computed((): number => {
  return Math.min(40 / store.scale, (family.value.spacing * 2) / 3);
});

const title = computed((): string => {
  return `${props.variety.name} ${family.value.name}`;
});
</script>
<template>
  <g
    :class="interactive ? 'interactive' : 'non-interactive'"
    @click="$emit('click', $event)"
  >
    <template v-if="store.scaleRange > 1">
      <circle
        v-if="drawSpacing"
        :r="family.spacing / 2"
        class="spacingCircle"
      />
      <PlantIcon
        no-svg
        :size="iconSize"
        :color="variety.color"
        :family-id="family.id"
        class="icon"
        :x="-iconSize / 2"
        :y="-iconSize / 2"
      />
    </template>

    <circle
      v-else
      :r="family.spacing / 2"
      :fill="variety.color"
      class="solidCircle"
    />

    <title>{{ title }}</title>
  </g>
</template>

<style scoped lang="scss">
.interactive {
  pointer-events: auto;
}
.non-interactive {
  pointer-events: none;
}

.solidCircle {
  opacity: 75%;
  stroke: none;
}

.solidCircle:hover {
  opacity: 90%;
}

.spacingCircle {
  fill: gray;
  fill-opacity: 0;
  stroke: gray;
  stroke-dasharray: 5 5;
}

.spacingCircle:hover {
  fill-opacity: 0.5;
}

.icon {
  pointer-events: none;
}
</style>

<script setup lang="ts">
import { withDefaults, computed } from "vue";
import { state } from "../state/State";
import type { Variety } from "@mendel/common";

const props = withDefaults(defineProps<{
  variety: Variety;
  drawSpacing: boolean;
  interactive: boolean;
}>(), {
  drawSpacing: true,
  interactive: true
});

const family = computed(() => {
  if (props.variety.family) {
    return props.variety.family;
  }

  throw new Error("Variety has no family");
});

const iconSize = computed((): number => {
  return Math.min(40 / state.scale, (family.value.spacing * 2) / 3);
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
    <template v-if="state.scaleRange > 1">
      <circle
        v-if="drawSpacing"
        :r="family.spacing / 2"
        class="spacingCircle"
      />
      <use
        :width="iconSize"
        :height="iconSize"
        :x="-iconSize / 2"
        :y="-iconSize / 2"
        :href="`#family-${family.id}`"
        :fill="variety.color"
        class="icon"
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

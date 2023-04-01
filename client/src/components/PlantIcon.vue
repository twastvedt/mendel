<script setup lang="ts">
withDefaults(
  defineProps<{
    noSvg?: boolean;
    color: string;
    familyId?: number;
    size?: number;
  }>(),
  {
    size: 32,
  }
);
</script>
<template>
  <use
    v-if="noSvg"
    v-bind="$props"
    class="plantIcon"
    :href="`#family-${familyId}`"
    :style="`fill: ${color}`"
    :width="size"
    :height="size"
  />
  <svg
    v-else
    v-bind="$props"
    class="plantIcon"
    :width="size"
    :height="size"
    :style="`fill: ${color}`"
  >
    <use :href="`#family-${familyId}`" />
  </svg>
</template>
<style scoped>
.plantIcon {
  stroke: black;
}
</style>

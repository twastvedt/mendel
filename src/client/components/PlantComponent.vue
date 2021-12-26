<template>
  <g>
    <use width="1" height="1" :href="`#family-${plant.variety.family.id}`" />
    <circle :r="plant.variety.family.spacing" class="spacingCircle" />
  </g>
</template>

<script lang="ts">
import { Plant } from "@/entity/Plant";
import { PropType } from "vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
  props: {
    plant: Object as PropType<Plant>,
  },
})
export default class PlantComponent extends Vue {}
</script>

<style scoped lang="scss">
.spacingCircle {
  fill: none;
  stroke: gray;
  stroke-dasharray: 5 5;
}
</style>

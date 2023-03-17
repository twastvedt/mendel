<template>
  <g>
    <PlantingComponent
      :planting="planting"
      :locations="locations"
      :is-cursor="true"
      :plants-interactive="false"
    />

    <RotationTool :cursor="cursor" :rotation-center="rotationCenter" />
  </g>
</template>

<script lang="ts">
import { Planting, Variety, Position } from "@mendel/common";
import { Component, Prop, Vue } from "vue-property-decorator";
import PlantingComponent from "./PlantingComponent.vue";
import RotationTool from "./RotationTool.vue";

@Component({
  components: {
    PlantingComponent,
    RotationTool,
  },
})
export default class DrawPlantRow extends Vue {
  @Prop() readonly planting!: Planting;
  @Prop() readonly locations!: Position[];
  @Prop() readonly cursor?: Position;
  @Prop() readonly rotationCenter?: Position;

  get radius(): number | undefined {
    if (this.variety.family) {
      return this.variety.family.spacing / 2;
    }

    return undefined;
  }

  get variety(): Variety {
    if (this.planting.variety) {
      return this.planting.variety;
    }

    throw new Error("Planting has no variety");
  }
}
</script>
<style lang="scss" scoped></style>

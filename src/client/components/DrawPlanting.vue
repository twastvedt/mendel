<template>
  <g>
    <PlantingComponent :planting="planting" :is-cursor="true" />

    <PlantComponent
      :interactive="false"
      :variety="variety"
      :transform="state.makeTransform(cursor)"
      :draw-spacing="false"
    />
  </g>
</template>

<script lang="ts">
import { Planting } from "@/entity/Planting";
import { Component, Prop, Vue } from "vue-property-decorator";
import Store from "../Store";
import { Variety } from "@/entity/Variety";
import PlantingComponent from "./PlantingComponent.vue";
import PlantComponent from "./PlantComponent.vue";

@Component({
  components: {
    PlantingComponent,
    PlantComponent,
  },
})
export default class DrawPlanting extends Vue {
  @Prop() readonly planting!: Planting;
  @Prop() readonly cursor!: [number, number];

  get variety(): Variety {
    if (this.planting.variety) {
      return this.planting.variety;
    }

    throw new Error("Planting has no variety");
  }

  state = Store.state;
}
</script>
<style scoped>
g {
  pointer-events: none;
}
</style>

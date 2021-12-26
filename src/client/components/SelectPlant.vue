<template>
  <v-list dense>
    <v-list-item-group v-model="selected">
      <template v-for="family in state.varietiesByFamily">
        <v-list-item
          v-for="variety in family.varieties"
          :key="variety.id"
          :value="variety.id"
          @click="onSelected(variety)"
        >
          <v-list-item-icon>
            <v-list-item-avatar class="icon" :style="`fill: ${variety.color}`">
              <svg><use :href="`#family-${family.id}`" /></svg>
            </v-list-item-avatar>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="variety.name"></v-list-item-title>
            <v-list-item-subtitle v-text="family.name"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list-item-group>

    <v-list-item>
      <v-list-item-content>
        <AddNewVariety v-show="!showNewForm" @blur="showNewForm = false" />
        <v-btn v-show="showNewForm" @click="showNewForm = true"> + </v-btn>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Store from "../Store";
import { DrawPlantTool } from "../tools/DrawPlantTool";
import AddNewVariety from "./AddNewVariety.vue";
import { Variety } from "@/entity/Variety";

@Component({
  components: {
    AddNewVariety,
  },
})
export default class SelectPlant extends Vue {
  state = Store.state;

  showNewForm = false;

  selected: number | [] = [];

  mounted(): void {
    this.state.loadVarieties();
  }

  onSelected(variety: Variety): void {
    if (this.state.garden) {
      this.state.setTool(new DrawPlantTool(variety, this.state.garden));

      this.selected = variety.id;
    }
  }
}
</script>

<style scoped lang="scss">
@import "../styles/variables.scss";

.icon {
  stroke: black;
}

.v-card {
  height: 100%;
}
</style>

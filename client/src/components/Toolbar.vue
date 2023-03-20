<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { state } from "../state/State";
import { DrawPlantTool } from "../tools/DrawPlantTool";
import { DeletePlantTool } from "../tools/DeletePlantTool";
import { DrawRowTool } from "../tools/DrawRowTool";
import { DeletePlantingTool } from "../tools/DeletePlantingTool";
import { Variety } from "@mendel/common";
import { DrawPlantingTool } from "../tools/DrawPlantingTool";
import SelectVariety from "./fields/SelectVariety.vue";

const varietySelectDisabled = computed(() => {
  return (
    state.toolName === "deletePlant" || state.toolName === "deletePlanting"
  );
});

const variety = ref<Variety | undefined>(undefined);

function newTool(newTool: string): void {
  if (state.db) {
    switch (newTool) {
      case "drawPlant":
        if (!variety.value) {
          variety.value = state.db.varieties[0];
        }

        state.setTool(new DrawPlantTool(variety.value));

        break;
      case "drawRow":
        if (variety.value) {
          state.setTool(new DrawRowTool(variety.value));
        }
        break;
      case "drawPlanting":
        if (!variety.value) {
          variety.value = state.db.varieties[0];
        }

        if (state.db.grid) {
          state.setTool(new DrawPlantingTool(variety.value, state.db.grid));
        }
        break;
      case "deletePlant":
        state.setTool(new DeletePlantTool());
        break;
      case "deletePlanting":
        state.setTool(new DeletePlantingTool());
        break;
    }
  }
}

watch(variety, newVariety);

function newVariety(newVariety?: Variety): void {
  if (
    newVariety &&
    (state.toolName === "drawPlant" ||
      state.toolName === "drawPlanting" ||
      state.toolName === "drawRow")
  ) {
    newTool(state.toolName);
  }
}
</script>

<template>
  <v-toolbar dense floating>
    <v-btn-toggle v-model="state.toolName" borderless @change="newTool">
      <v-btn icon value="drawPlant" title="Add plant">
        <v-icon>mdi-sprout</v-icon>
      </v-btn>
      <v-btn icon value="drawRow" title="Add row of plants">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
      <v-btn icon value="drawPlanting" title="Add planting">
        <v-icon>mdi-dots-hexagon</v-icon>
      </v-btn>
      <v-btn icon value="deletePlant" title="Delete plant">
        <v-icon>mdi-sprout</v-icon>
        <v-icon class="badge" color="red darken-4">mdi-close</v-icon>
      </v-btn>
      <v-btn icon value="deletePlanting" title="Delete planting">
        <v-icon>mdi-dots-hexagon</v-icon>
        <v-icon class="badge" color="red darken-4">mdi-close</v-icon>
      </v-btn>
    </v-btn-toggle>

    <SelectVariety v-model="variety" :disabled="varietySelectDisabled" />
  </v-toolbar>
</template>

<style scoped lang="scss">
.icon {
  stroke: black;
}

.avatar {
  height: 32px;
  width: 32px;
  margin-right: 8px;
}

.v-icon.badge {
  height: 50%;
  width: 50%;
  position: absolute;
  display: block;
  right: 15%;
  bottom: 15%;
}
</style>

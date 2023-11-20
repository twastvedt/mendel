<script setup lang="ts">
import { computed, ref } from "vue";
import { useRootStore } from "../state/rootStore";
import { DrawPlantTool } from "../tools/DrawPlantTool";
import { DeletePlantTool } from "../tools/DeletePlantTool";
import { DrawRowTool } from "../tools/DrawRowTool";
import { DeletePlantingTool } from "../tools/DeletePlantingTool";
import type { Variety } from "@mendel/common";
import { DrawPlantingTool } from "../tools/DrawPlantingTool";
import SelectVariety from "./fields/SelectVariety.vue";
import { useGardenStore } from "@/state/gardenStore";
import type { PolygonGrid } from "@/services/polygonGrid";

const store = useRootStore();
const gardenStore = useGardenStore();

const varietySelectDisabled = computed(() => {
  return (
    store.toolName === "deletePlant" || store.toolName === "deletePlanting"
  );
});

const variety = ref<Variety | undefined>(undefined);

function newTool(newTool: string): void {
  switch (newTool) {
    case "drawPlant":
      if (!variety.value) {
        variety.value = gardenStore.varieties[0];
      }

      store.setTool(new DrawPlantTool(variety.value));

      break;
    case "drawRow":
      if (!variety.value) {
        variety.value = gardenStore.varieties[0];
      }

      store.setTool(new DrawRowTool(variety.value));
      break;
    case "drawPlanting":
      if (!variety.value) {
        variety.value = gardenStore.varieties[0];
      }

      if (gardenStore.grid) {
        store.setTool(
          new DrawPlantingTool(variety.value, gardenStore.grid as PolygonGrid),
        );
      }
      break;
    case "deletePlant":
      store.setTool(new DeletePlantTool());
      break;
    case "deletePlanting":
      store.setTool(new DeletePlantingTool());
      break;
  }
}

function newVariety(newVariety?: Variety): void {
  if (
    newVariety &&
    (store.toolName === "drawPlant" ||
      store.toolName === "drawPlanting" ||
      store.toolName === "drawRow")
  ) {
    newTool(store.toolName);
  }
}
</script>

<template>
  <v-card density="compact" elevation="1" class="toolbar">
    <v-btn-toggle
      v-model="store.toolName"
      borderless
      @update:model-value="newTool"
    >
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
        <v-icon class="badge" color="red-darken-4">mdi-close</v-icon>
      </v-btn>
      <v-btn icon value="deletePlanting" title="Delete planting">
        <v-icon>mdi-dots-hexagon</v-icon>
        <v-icon class="badge" color="red-darken-4">mdi-close</v-icon>
      </v-btn>
    </v-btn-toggle>

    <SelectVariety
      v-model="variety"
      :disabled="varietySelectDisabled"
      @update:model-value="newVariety"
      class="dropdown"
    />
  </v-card>
</template>

<style scoped lang="scss">
.toolbar {
  display: flex;
  align-items: center;
  height: 48px;
}

.dropdown {
  width: 400px;
}

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

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

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { state } from "../state/State";
import { DrawPlantTool } from "../tools/DrawPlantTool";
import { DeletePlantTool } from "../tools/DeletePlantTool";
import { DrawRowTool } from "../tools/DrawRowTool";
import { DeletePlantingTool } from "../tools/DeletePlantingTool";
import { Variety } from "@mendel/common";
import { DrawPlantingTool } from "../tools/DrawPlantingTool";
import SelectVariety from "./fields/SelectVariety.vue";

@Component({ components: { SelectVariety } })
export default class Toolbar extends Vue {
  state = state;

  get varietySelectDisabled() {
    return (
      state.toolName === "deletePlant" || state.toolName === "deletePlanting"
    );
  }

  variety: Variety | null = null;

  newTool(newTool: string): void {
    if (state.db) {
      switch (newTool) {
        case "drawPlant":
          if (!this.variety) {
            this.variety = state.db.varieties[0];
          }

          state.setTool(new DrawPlantTool(this.variety));

          break;
        case "drawRow":
          if (this.variety) {
            state.setTool(new DrawRowTool(this.variety));
          }
          break;
        case "drawPlanting":
          if (!this.variety) {
            this.variety = state.db.varieties[0];
          }

          if (state.db.grid) {
            state.setTool(new DrawPlantingTool(this.variety, state.db.grid));
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

  @Watch("variety")
  newVariety(newVariety?: Variety): void {
    if (
      newVariety &&
      (state.toolName === "drawPlant" ||
        state.toolName === "drawPlanting" ||
        state.toolName === "drawRow")
    ) {
      this.newTool(state.toolName);
    }
  }
}
</script>

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

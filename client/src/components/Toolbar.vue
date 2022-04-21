<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click.stop="state.drawer = !state.drawer" />

    <v-btn-toggle v-model="state.toolName" @change="newTool">
      <v-btn value="drawPlant" title="Add plant">
        <v-icon>mdi-sprout</v-icon></v-btn
      >
      <v-btn value="drawPlanting" title="Add planting">
        <v-icon>mdi-dots-hexagon</v-icon></v-btn
      >
      <v-btn value="deletePlant" title="Delete plant">
        <v-icon>mdi-sprout</v-icon>
        <v-icon class="badge" color="red darken-4">mdi-close</v-icon>
      </v-btn>
      <v-btn value="deletePlanting" title="Delete planting">
        <v-icon>mdi-dots-hexagon</v-icon
        ><v-icon class="badge" color="red darken-4">mdi-close</v-icon>
      </v-btn>
    </v-btn-toggle>

    <v-select
      v-model="variety"
      class="ml-3"
      :disabled="disableVarietySelect"
      :items="varietyList"
      dense
      solo
      flat
      outlined
      hide-details
      item-text="name"
      item-value="id"
      no-data-text="Add a plant variety"
      return-object
      :filter="varietyFilter"
      @change="newVariety"
    >
      <template #selection="{ item }">
        <svg class="icon avatar" :style="`fill: ${item.color}`">
          <use :href="`#family-${item.familyId}`" />
        </svg>
        {{ item.name }} - {{ item.family.name }}
      </template>

      <template #item="{ item }">
        <v-list-item-avatar class="icon" :style="`fill: ${item.color}`">
          <svg><use :href="`#family-${item.familyId}`" /></svg>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="item.name"></v-list-item-title>
          <v-list-item-subtitle
            v-text="item.family.name"
          ></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </v-select>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { state } from "../Store";
import { DrawPlantTool } from "../tools/DrawPlantTool";
import { DeletePlantTool } from "../tools/DeletePlantTool";
import { DeletePlantingTool } from "../tools/DeletePlantingTool";
import { Variety, Family } from "@mendel/common";
import { DrawPlantingTool } from "../tools/DrawPlantingTool";

@Component({})
export defineComponent({
  name: "Toolbar",
  state = state;

  disableVarietySelect = false;

  variety: Variety | null = null;

  get varietyList(): (Variety | { divider: boolean })[] {
    return (
      state.garden?.families
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter(
          (f): f is Family & Required<Pick<Family, "varieties">> =>
            !!f.varieties?.length
        )
        .flatMap((f) => [
          { divider: true },
          ...f.varieties.sort((a, b) => a.name.localeCompare(b.name)),
        ]) ?? []
    );
  }

  async mounted(): Promise<void> {
    await state.ready;

    this.variety = this.varietyList[1] as Variety;
  }

  varietyFilter(item: Variety, queryText: string): boolean {
    return (
      `${item.name} ${item.family?.name}`
        .toLocaleLowerCase()
        .indexOf(queryText.toLocaleLowerCase()) > -1
    );
  }

  newTool(newTool: string): void {
    if (state.garden) {
      switch (newTool) {
        case "drawPlant":
          if (this.variety) {
            state.setTool(new DrawPlantTool(this.variety));
          }

          break;
        case "drawPlanting":
          if (this.variety && state.garden.grid) {
            state.setTool(
              new DrawPlantingTool(this.variety, state.garden.grid)
            );
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

  newVariety(newVariety: Variety): void {
    if (
      newVariety &&
      (state.toolName === "drawPlant" || state.toolName === "drawPlanting")
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

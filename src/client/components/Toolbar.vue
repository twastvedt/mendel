<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click.stop="state.drawer = !state.drawer" />

    <v-btn-toggle v-model="state.toolName" @change="newTool">
      <v-btn value="drawPlant"> <v-icon>mdi-sprout</v-icon></v-btn>
      <v-btn value="drawPlanting"> <v-icon>mdi-dots-hexagon</v-icon></v-btn>
      <v-btn value="delete"> <v-icon>mdi-close</v-icon></v-btn>
    </v-btn-toggle>

    <v-select
      v-model="variety"
      :disabled="disableVarietySelect"
      :items="varietyList"
      dense
      solo
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
import Store from "../Store";
import { DrawPlantTool } from "../tools/DrawPlantTool";
import { DeletePlantTool } from "../tools/DeletePlantTool";
import { Variety } from "@/entity/Variety";
import { DrawPlantingTool } from "../tools/DrawPlantingTool";

@Component({})
export default class Toolbar extends Vue {
  state = Store.state;

  disableVarietySelect = false;

  variety: Variety | null = null;

  get varietyList(): (Variety | { divider: boolean })[] {
    return this.state.families
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((f) => f.varieties.length)
      .flatMap((f) => [
        { divider: true },
        ...f.varieties.sort((a, b) => a.name.localeCompare(b.name)),
      ]);
  }

  async mounted(): Promise<void> {
    await this.state.ready;

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
    if (this.state.garden) {
      switch (newTool) {
        case "drawPlant":
          if (this.variety) {
            this.state.setTool(new DrawPlantTool(this.variety));
          }

          break;
        case "drawPlanting":
          if (this.variety) {
            this.state.setTool(new DrawPlantingTool(this.variety));
          }
          break;
        case "delete":
          this.state.setTool(new DeletePlantTool());
          break;
      }
    }
  }

  newVariety(newVariety: Variety): void {
    if (
      newVariety &&
      (this.state.toolName === "drawPlant" ||
        this.state.toolName === "drawPlanting")
    ) {
      this.newTool(this.state.toolName);
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
</style>

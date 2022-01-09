<template>
  <v-container>
    <v-row>
      <v-btn-toggle v-model="state.toolName" @change="newTool">
        <v-btn value="drawPlant"> <v-icon>mdi-sprout</v-icon></v-btn>
        <v-btn value="drawBed"> <v-icon>mdi-dots-hexagon</v-icon></v-btn>
        <v-btn value="delete"> <v-icon>mdi-close</v-icon></v-btn>
      </v-btn-toggle>
    </v-row>

    <v-row>
      <v-autocomplete
        v-model="variety"
        :disabled="disableVarietySelect"
        :items="varietyList"
        filled
        label="Variety"
        item-text="name"
        item-value="id"
        no-data-text="Add a plant variety"
        return-object
        :filter="varietyFilter"
        @change="newVariety"
      >
        <template #selection="{ item }">
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
      </v-autocomplete>
    </v-row>

    <v-row>
      <AddNewVariety v-show="!showNewForm" @blur="showNewForm = false" />
      <v-btn v-show="showNewForm" @click="showNewForm = true"> + </v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Store from "../Store";
import { DrawPlantTool } from "../tools/DrawPlantTool";
import { DeletePlantTool } from "../tools/DeletePlantTool";
import AddNewVariety from "./AddNewVariety.vue";
import { Variety } from "@/entity/Variety";

@Component({
  components: {
    AddNewVariety,
  },
})
export default class Sidebar extends Vue {
  state = Store.state;

  showNewForm = false;

  disableVarietySelect = false;

  variety: Variety | null = null;

  get varietyList(): (Variety | { divider: boolean })[] {
    return this.state.varietiesByFamily
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((f) => f.varieties.length)
      .flatMap((f) => [
        { divider: true },
        ...f.varieties.sort((a, b) => a.name.localeCompare(b.name)),
      ]);
  }

  async mounted(): Promise<void> {
    await this.state.loadVarieties();

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
        case "drawBed":
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
      (this.state.toolName === "drawPlant" || this.state.toolName === "drawBed")
    ) {
      this.state.setTool(new DrawPlantTool(newVariety));
    }
  }
}
</script>

<style scoped lang="scss">
.icon {
  stroke: black;
}

.v-card {
  height: 100%;
}
</style>

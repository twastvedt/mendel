<template>
  <v-card height="100%">
    <v-toolbar dark dense>
      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <SelectVariety v-model="variety" @change="" />

    <v-list two-line>
      <v-list-item v-for="(item, i) of state.selection" :key="i">
        <template v-if="item.type == 'planting'">
          <v-list-item-icon>
            <v-icon>mdi-dots-hexagon</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              {{ item.item.variety.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ item.item.variety.family.name }}
              ({{ item.item.locations.coordinates.length }})
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-avatar>
            <svg
              class="icon avatar"
              :style="`fill: ${item.item.variety.color}`"
            >
              <use :href="`#family-${item.item.variety.familyId}`" />
            </svg>
          </v-list-item-avatar>
        </template>

        <template v-if="item.type == 'plant'">
          <v-list-item-icon>
            <v-icon>mdi-sprout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              {{ item.item.variety.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ item.item.variety.family.name }}
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-avatar>
            <svg
              class="icon avatar"
              :style="`fill: ${item.item.variety.color}`"
            >
              <use :href="`#family-${item.item.variety.familyId}`" />
            </svg>
          </v-list-item-avatar>
        </template>

        <template v-if="item.type == 'bed'">
          <v-list-item-icon>
            <v-icon>mdi-rectangle-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Bed</v-list-item-title>
          </v-list-item-content>
        </template>

        <template v-if="item.type == 'area'">
          <v-list-item-icon>
            <v-icon>mdi-rectangle</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Area</v-list-item-title>
          </v-list-item-content>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { Variety } from "@mendel/common";
import { Component, Vue, Watch } from "vue-property-decorator";
import { state } from "../state/State";
import { UiElement, UiElementType } from "../types/entityTypes";

import SelectVariety from "./fields/SelectVariety.vue";

@Component({
  components: {
    SelectVariety,
  },
})
export default class DetailsPane extends Vue {
  state = state;

  variety: Variety | null = null;
  title = "";

  @Watch("state.selection", { immediate: true })
  newSelection(selection: UiElement[]) {
    const totals: Record<UiElementType, number> = {
      bed: 0,
      planting: 0,
      plant: 0,
      area: 0,
    };

    let variety: Variety | null | false = null;

    for (const item of selection) {
      totals[item.type]++;

      if (
        variety !== false &&
        (item.type === "plant" || item.type === "planting") &&
        item.item.variety
      ) {
        if (!variety) {
          variety = item.item.variety;
        } else if (variety !== item.item.variety) {
          variety = false;
        }
      }
    }

    this.variety = variety ? variety : null;

    let titleParts = [];

    if (totals.plant) {
      titleParts.push(`${totals.plant} plant${totals.plant !== 1 ? "s" : ""}`);
    }

    if (totals.planting) {
      titleParts.push(
        `${totals.planting} planting${totals.planting !== 1 ? "s" : ""}`
      );
    }

    if (totals.bed) {
      titleParts.push(`${totals.bed} bed${totals.bed !== 1 ? "s" : ""}`);
    }

    if (totals.area) {
      titleParts.push(`${totals.area} area${totals.area !== 1 ? "s" : ""}`);
    }

    this.title = titleParts.join(", ");
  }
}
</script>

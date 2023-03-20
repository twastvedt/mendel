<script setup lang="ts">
import { watch } from 'vue'
import type { Variety } from "@mendel/common";
import { state } from "../state/State";
import type { UiElement, UiElementType } from "../types/entityTypes";

import SelectVariety from "./fields/SelectVariety.vue";

let variety: Variety | null = null;
let title = "";

watch(state.selection, (selection: UiElement[]) => {
  const totals: Record<UiElementType, number> = {
    bed: 0,
    planting: 0,
    plant: 0,
    area: 0,
  };

  let innerVariety: Variety | undefined | false;

  for (const item of selection) {
    totals[item.type]++;

    let thisVariety: Variety | undefined;

    if (item.type === "plant") {
      thisVariety = item.item.planting?.variety;
    } else if (item.type === "planting") {
      thisVariety = item.item.variety;
    }

    if (innerVariety !== false) {
      if (!innerVariety) {
        innerVariety = thisVariety;
      } else if (innerVariety !== thisVariety) {
        innerVariety = false;
      }
    }
  }

  variety = innerVariety ? innerVariety : null;

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

  title = titleParts.join(", ");
}, { immediate: true })
</script>
<template>
  <v-card height="100%">
    <v-toolbar dark dense>
      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <SelectVariety v-model="variety" />

    <v-list two-line>
      <v-list-item v-for="(item, i) of state.selection" :key="i">
        <template v-if="item.type == 'planting'">
          <v-list-item-icon>
            <v-icon>mdi-dots-hexagon</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              {{ item.item.variety?.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ item.item.variety?.family?.name }}
              ({{ item.item.plants?.length }})
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-avatar>
            <svg
              class="icon avatar"
              :style="`fill: ${item.item.variety?.color}`"
            >
              <use :href="`#family-${item.item.variety?.familyId}`" />
            </svg>
          </v-list-item-avatar>
        </template>

        <template v-if="item.type == 'plant'">
          <v-list-item-icon>
            <v-icon>mdi-sprout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              {{ item.item.planting?.variety?.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ item.item.planting?.variety?.family?.name }}
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-avatar>
            <svg
              class="icon avatar"
              :style="`fill: ${item.item.planting?.variety?.color}`"
            >
              <use :href="`#family-${item.item.planting?.variety?.familyId}`" />
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

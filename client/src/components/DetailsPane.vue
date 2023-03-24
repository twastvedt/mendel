<script setup lang="ts">
import { watch, ref } from "vue";
import type { VarietyLocal } from "@mendel/common";
import { useRootStore } from "../state/rootStore";
import type { UiElement, UiElementType } from "../types/entityTypes";
import { getEntityIcon } from "../types/entityTypes";

import SelectVariety from "./fields/SelectVariety.vue";

const store = useRootStore();
let variety = ref<VarietyLocal | undefined>(undefined);
let title = "";

watch(
  store.selection,
  (selection: UiElement[]) => {
    const totals: Record<UiElementType, number> = {
      bed: 0,
      planting: 0,
      plant: 0,
      area: 0,
    };

    let innerVariety: VarietyLocal | undefined | false;

    for (const item of selection) {
      totals[item.type]++;

      let thisVariety: VarietyLocal | undefined;

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

    variety.value = innerVariety ? innerVariety : undefined;

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
  },
  { immediate: true }
);
</script>
<template>
  <v-card height="100%">
    <v-toolbar theme="dark" density="comfortable">
      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <SelectVariety v-model="variety" />

    <v-list lines="two">
      <v-list-item
        v-for="(item, i) of store.selection"
        :key="i"
        :prepend-icon="getEntityIcon(item)"
      >
        <template v-if="item.type == 'planting'">
          <v-list-item-title>
            {{ item.item.variety?.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ item.item.variety?.family?.name }}
            ({{ item.item.plants.length }})
          </v-list-item-subtitle>
        </template>

        <template v-if="item.type == 'plant'">
          <v-list-item-title>
            {{ item.item.planting?.variety?.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ item.item.planting?.variety?.family?.name }}
          </v-list-item-subtitle>
        </template>

        <template #append>
          <v-avatar v-if="item.type == 'planting'">
            <svg
              class="icon avatar"
              :style="`fill: ${item.item.variety?.color}`"
            >
              <use :href="`#family-${item.item.variety?.familyId}`" />
            </svg>
          </v-avatar>
          <v-avatar v-if="item.type == 'plant'">
            <svg
              class="icon avatar"
              :style="`fill: ${item.item.planting?.variety?.color}`"
            >
              <use :href="`#family-${item.item.planting?.variety?.familyId}`" />
            </svg>
          </v-avatar>
        </template>

        <template v-if="item.type == 'bed'">
          <v-list-item-title>Bed</v-list-item-title>
        </template>

        <template v-if="item.type == 'area'">
          <v-list-item-title>Area</v-list-item-title>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

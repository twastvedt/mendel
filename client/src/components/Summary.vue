<script setup lang="ts">
import { useGardenStore } from "../state/gardenStore";
// import type { DataTableHeader } from 'vuetify/labs/VDataTable';
import type { DataTableHeader } from "@/types/vuetifyTypes";
import { polygonArea } from "d3-polygon";
import { bboxArea, polygonBounds } from "../geometry/polygonTools";
import type { Variety } from "@mendel/common";
import { computed } from "vue";
import PlantIcon from "./PlantIcon.vue";

const gardenStore = useGardenStore();

const headers: DataTableHeader[] = [
  {
    title: "",
    key: "icon",
    width: 32,
  },
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Family",
    key: "family.name",
  },
  {
    title: "Spacing",
    align: "end",
    key: "spacing",
  },
  {
    title: "Plants (current plan)",
    align: "end",
    key: "plants",
  },
];

const totalArea = computed((): number | undefined => {
  const beds = gardenStore.garden?.beds;

  if (beds) {
    return (
      bboxArea(
        beds.reduce(
          (bounds, bed) => polygonBounds(bed.shape.coordinates[0], bounds),
          [
            ...beds[0].shape.coordinates[0][0],
            ...beds[0].shape.coordinates[0][1],
          ],
        ),
      ) / 144
    );
  }

  return undefined;
});

const areas = {
  Beds:
    (gardenStore.garden?.beds.reduce(
      (total, bed) => total + polygonArea(bed.shape.coordinates[0]),
      0,
    ) ?? 0) / 144,
  Total: totalArea.value,
};

function plantCount(variety: Variety): number | undefined {
  return gardenStore.plantCount({ varietyId: variety.id });
}
</script>
<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Varieties</v-card-title>
          <v-data-table
            :items="gardenStore.varieties"
            name="Varieties"
            :headers="headers"
          >
            <template #[`item.plants`]="{ item }">
              {{ plantCount(item) }}
            </template>

            <template #[`item.icon`]="{ item }">
              <plant-icon
                class="plantAvatar"
                :color="item.color"
                :family-id="item.familyId"
              />
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Areas</v-card-title>
          <v-table>
            <template #default>
              <tbody>
                <tr v-for="(value, key) in areas" :key="key">
                  <td>{{ key }}</td>
                  <td v-if="value !== undefined">
                    {{ Math.round(value).toLocaleString() }} sq. ft.
                  </td>
                  <td v-else>-</td>
                </tr>
              </tbody>
            </template>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useGardenStore } from "../state/gardenStore";
// import type { DataTableHeader } from 'vuetify/labs/VDataTable';
import type { DataTableHeader } from "@/types/vuetifyTypes";
import EditVariety from "./EditVariety.vue";
import EditDataTable from "./EditDataTable.vue";
import type { Variety } from "@mendel/common";

const gardenStore = useGardenStore();

const varietyHeaders: DataTableHeader[] = [
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Color",
    key: "color",
  },
  {
    title: "Family",
    key: "family.name",
  },
  {
    title: "Plants",
    key: "plants",
  },
];

function plantCount(variety: Variety): number | undefined {
  return gardenStore.plantCount({ varietyId: variety.id });
}
</script>
<template>
  <v-container>
    <EditDataTable
      v-model="gardenStore.varieties"
      name="Varieties"
      :headers="varietyHeaders"
      @delete="(item) => gardenStore.deleteVariety(item)"
    >
      <template #default="props">
        <EditVariety
          :value="props.value"
          @close="props.close"
          @input="(item) => gardenStore.editVariety(item)"
        />
      </template>

      <template #[`item.plants`]="{ item }">
        {{ plantCount(item.raw) }}
      </template>

      <template #[`item.color`]="{ item }">
        <svg class="svgicon" style="height: 32px; width: 32px">
          <use :href="`#family-${item.raw.family.id}`" :fill="item.raw.color" />
        </svg>
      </template>
    </EditDataTable>
  </v-container>
</template>

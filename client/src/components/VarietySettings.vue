<script setup lang="ts">
import { useGardenStore } from "../state/gardenStore";
// import type { DataTableHeader } from 'vuetify/labs/VDataTable';
import type { DataTableHeader } from "@/types/vuetifyTypes";
import EditVariety from "./EditVariety.vue";
import EditDataTable from "./EditDataTable.vue";
import type { Variety } from "@mendel/common";
import PlantIcon from "./PlantIcon.vue";

const gardenStore = useGardenStore();

const varietyHeaders: DataTableHeader[] = [
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
    title: "Plants (current plan)",
    align: "end",
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
        {{ plantCount(item) }}
      </template>

      <template #[`item.icon`]="{ item }">
        <PlantIcon
          class="plantAvatar"
          :color="item.color"
          :family-id="item.familyId"
        />
      </template>
    </EditDataTable>
  </v-container>
</template>

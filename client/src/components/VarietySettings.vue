<script setup lang="ts">
import { state } from "../state/State";
// import type { DataTableHeader } from 'vuetify/labs/VDataTable';
import type { DataTableHeader } from "@/types/vuetifyTypes";
import EditVariety from "./EditVariety.vue";
import EditDataTable from "./EditDataTable.vue";
import type { Variety } from "@mendel/common";

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
  return state.db?.plantCount({ varietyId: variety.id });
}
</script>
<template>
  <v-container v-if="state.db">
    <EditDataTable
      v-model="state.db.varieties"
      name="Varieties"
      :headers="varietyHeaders"
      @delete="(item) => state.db?.deleteVariety(item)"
    >
      <template #default="props">
        <EditVariety
          :value="props.value"
          @close="props.close"
          @input="(item) => state.db?.editVariety(item)"
        />
      </template>

      <template #[`item.plants`]="{ item }">
        {{ plantCount(item) }}
      </template>

      <template #[`item.color`]="{ item }">
        <svg class="svgicon" style="height: 32px; width: 32px">
          <use :href="`#family-${item.family.id}`" :fill="item.color" />
        </svg>
      </template>
    </EditDataTable>
  </v-container>
</template>

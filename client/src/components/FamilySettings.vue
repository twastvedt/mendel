<script setup lang="ts">
import { state } from "../state/State";
// import type { DataTableHeader } from 'vuetify/labs/VDataTable';
import type { DataTableHeader } from '@/types/vuetifyTypes';
import EditFamily from "./EditFamily.vue";
import EditDataTable from "./EditDataTable.vue";
import type { Family } from "@mendel/common";

const headers: DataTableHeader[] = [
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Color",
    key: "color",
  },
  {
    title: "Spacing",
    key: "spacing",
  },
  {
    title: "Nitrogen",
    key: "nitrogen",
  },
  {
    title: "Plants",
    key: "plants",
  },
];

function plantCount(family: Family): number | undefined {
  return state.db?.plantCount({ familyId: family.id });
}

async function deleteFamily(family: Family): Promise<void> {
  const varieties =
    family.varieties?.length ??
    state.db?.varieties.filter((v) => v.familyId === family.id).length;

  if (varieties) {
    alert(`Can't delete family which still has ${varieties} varietie(s).`);
  } else {
    state.db?.deleteFamily(family);
  }
}
</script>
<template>
  <v-container v-if="state.db">
    <EditDataTable
      v-model="state.db.families"
      name="Families"
      :headers="headers"
      @delete="deleteFamily"
    >
      <template #default="props">
        <EditFamily
          :value="props.value"
          @close="props.close"
          @input="(item) => state.db?.editFamily(item)"
        />
      </template>

      <template #[`item.plants`]="{ item }">
        {{ plantCount(item) }}
      </template>

      <template #[`item.color`]="{ item }">
        <svg class="svgicon" style="height: 32px; width: 32px">
          <use :href="`#family-${item.id}`" :fill="item.color" />
        </svg>
      </template>
    </EditDataTable>
  </v-container>
</template>

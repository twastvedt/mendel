<script setup lang="ts">
import { useGardenStore } from "../state/gardenStore";
// import type { DataTableHeader } from 'vuetify/labs/VDataTable';
import type { DataTableHeader } from "@/types/vuetifyTypes";
import EditFamily from "./EditFamily.vue";
import EditDataTable from "./EditDataTable.vue";
import type { Family } from "@mendel/common";

const garden = useGardenStore();

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
  return garden.plantCount({ familyId: family.id });
}

async function deleteFamily(family: Family): Promise<void> {
  const varieties =
    family.varieties?.length ??
    garden.varieties.filter((v) => v.familyId === family.id).length;

  if (varieties) {
    alert(`Can't delete family which still has ${varieties} varietie(s).`);
  } else {
    garden.deleteFamily(family);
  }
}
</script>
<template>
  <v-container v-if="garden.families">
    <EditDataTable
      v-model="garden.families"
      name="Families"
      :headers="headers"
      @delete="deleteFamily"
    >
      <template #default="props">
        <EditFamily
          :value="props.value"
          @close="props.close"
          @input="(item) => garden.editFamily(item)"
        />
      </template>

      <template #[`item.plants`]="{ item }">
        {{ plantCount(item.raw) }}
      </template>

      <template #[`item.color`]="{ item }">
        <svg class="svgicon" style="height: 32px; width: 32px">
          <use :href="`#family-${item.raw.id}`" :fill="item.raw.color" />
        </svg>
      </template>
    </EditDataTable>
  </v-container>
</template>

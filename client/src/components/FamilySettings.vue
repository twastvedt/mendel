<script setup lang="ts">
import { useGardenStore } from "../state/gardenStore";
// import type { DataTableHeader } from 'vuetify/labs/VDataTable';
import type { DataTableHeader } from "@/types/vuetifyTypes";
import EditFamily from "./EditFamily.vue";
import EditDataTable from "./EditDataTable.vue";
import type { Family } from "@mendel/common";

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
    title: "Spacing",
    align: "end",
    key: "spacing",
  },
  {
    title: "Nitrogen",
    align: "end",
    key: "nitrogen",
  },
  {
    title: "Plants (current plan)",
    align: "end",
    key: "plants",
  },
];

function plantCount(family: Family): number | undefined {
  return (
    gardenStore.currentPlan && gardenStore.plantCount({ familyId: family.id })
  );
}

async function deleteFamily(family: Family): Promise<void> {
  const varieties =
    family.varieties?.length ??
    gardenStore.varieties.filter((v) => v.familyId === family.id).length;

  if (varieties) {
    alert(`Can't delete family which still has ${varieties} varietie(s).`);
  } else {
    gardenStore.deleteFamily(family);
  }
}
</script>
<template>
  <v-container v-if="gardenStore.families">
    <EditDataTable
      v-model="gardenStore.families"
      name="Families"
      :headers="headers"
      @delete="deleteFamily"
    >
      <template #default="props">
        <EditFamily
          v-if="props"
          :value="props.value"
          @close="props.close"
          @input="(item) => gardenStore.editFamily(item)"
        />
      </template>

      <template #[`item.plants`]="{ item }">
        {{ plantCount(item.raw) }}
      </template>

      <template #[`item.icon`]="{ item }">
        <svg class="plantIcon">
          <use :href="`#family-${item.raw.id}`" :fill="item.raw.color" />
        </svg>
      </template>
    </EditDataTable>
  </v-container>
</template>

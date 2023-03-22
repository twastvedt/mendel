<script setup lang="ts">
// import type { DataTableHeader } from 'vuetify/labs/VDataTable';
import type { DataTableHeader } from "@/types/vuetifyTypes";
import { computed } from "vue";

const props = defineProps<{
  modelValue: unknown[];
  name: string;
  headers: DataTableHeader[];
  showExpand?: boolean;
}>();

let expanded = [] as unknown[];
let search = "";
let showDialog = false;
let currentIndex = null as number | null;

const fullHeaders = computed(() => {
  const headers: DataTableHeader[] = [
    ...props.headers,
    {
      title: "",
      key: "actions",
      align: "end",
      sortable: false,
      // TODO: cellClass: "smallColumn",
    },
  ];

  if (props.showExpand) {
    headers.push({
      title: "",
      key: "data-table-expand",
      // TODO: cellClass: "smallColumn",
    });
  }

  return headers;
});

function editItem(item: unknown): void {
  currentIndex = props.modelValue.indexOf(item);

  showDialog = true;
}

function expandAll(v: Event): void {
  if (v) {
    expanded = props.modelValue;
  } else {
    expanded = [];
  }
}
</script>
<template>
  <v-card>
    <v-card-title>
      {{ name }}
      <v-spacer />
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        clearable
        single-line
        hide-details
      >
        <template #append>
          <v-dialog v-model="showDialog">
            <template #activator="{ props }">
              <v-btn
                icon
                small
                class="mx-2"
                v-bind="props"
                @click="currentIndex = null"
              >
                <v-icon color="text-primary">mdi-plus</v-icon>
              </v-btn>
            </template>

            <slot
              :close="() => (showDialog = false)"
              :value="
                currentIndex !== null ? modelValue[currentIndex] : undefined
              "
            />
          </v-dialog>
        </template>
      </v-text-field>
    </v-card-title>

    <v-data-table
      v-bind="$attrs"
      :items="modelValue"
      :search="search"
      :headers="fullHeaders"
      :show-expand="showExpand"
      v-model:expanded="expanded"
    >
      <template #[`header.data-table-expand`]="{}">
        <v-checkbox
          false-icon="mdi-chevron-down"
          true-icon="mdi-chevron-up"
          @click:append="(v: Event) => expandAll(v)"
        />
      </template>

      <template #[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item.raw)">
          mdi-pencil
        </v-icon>
        <v-icon small class="mr-2" @click="$emit('delete', item.raw)">
          mdi-delete
        </v-icon>
      </template>

      <template #expanded-item="props">
        <slot name="expanded-item" v-bind="props" />
      </template>

      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </v-data-table>
  </v-card>
</template>

<style>
.smallColumn {
  width: 1px;
  white-space: nowrap;
}
</style>

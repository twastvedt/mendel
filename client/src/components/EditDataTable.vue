<script setup lang="ts">
// import type { DataTableHeader } from 'vuetify/labs/VDataTable';
import type { DataTableHeader } from '@/types/vuetifyTypes';

const props = defineProps<{
  value: unknown[];
  name: string;
  headers: DataTableHeader[];
  showExpand?: boolean;
}>();

let expanded = [] as unknown[];
let search = "";
let showDialog = false;
let currentIndex = null as number | null;

function fullHeaders(): DataTableHeader[] {
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
}

function editItem(item: unknown): void {
  currentIndex = props.value.indexOf(item);

  showDialog = true;
}

function expandAll(v: Event): void {
  if (v) {
    expanded = props.value;
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
        <template #append-outer>
          <v-dialog v-model="showDialog">
            <template #activator="{ props }">
              <v-btn
                fab
                small
                class="mx-2"
                v-bind="props"
                @click="currentIndex = null"
              >
                <v-icon color="primary">mdi-plus</v-icon>
              </v-btn>
            </template>

            <slot
              :close="() => (showDialog = false)"
              :value="currentIndex !== null ? value[currentIndex] : undefined"
            />
          </v-dialog>
        </template>
      </v-text-field>
    </v-card-title>

    <v-data-table
      v-bind="$attrs"
      :items="value"
      :search="search"
      :headers="fullHeaders"
      :show-expand="showExpand"
      :expanded.sync="expanded"
    >
      <template #[`header.data-table-expand`]="{}">
        <v-checkbox
          off-icon="mdi-chevron-down"
          on-icon="mdi-chevron-up"
          @change="(v: Event) => expandAll(v)"
        />
      </template>

      <template #[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small class="mr-2" @click="$emit('delete', item)">
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

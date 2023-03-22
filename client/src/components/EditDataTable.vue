<script setup lang="ts">
// import type { DataTableHeader } from 'vuetify/labs/VDataTable';
import type { DataTableHeader } from "@/types/vuetifyTypes";
import { computed, ref, useSlots } from "vue";

const dataTableSlots = Object.fromEntries(
  Object.entries(useSlots()).filter(
    ([key]) => key !== "default" && key !== "expanded-item"
  )
);

const props = defineProps<{
  modelValue: unknown[];
  name: string;
  headers: DataTableHeader[];
  showExpand?: boolean;
}>();

const expanded = ref<unknown[]>([]);
const search = ref("");
const showDialog = ref(false);
const currentIndex = ref<number | undefined>(undefined);

const fullHeaders = computed(() => {
  const headers: DataTableHeader[] = [
    ...props.headers,
    {
      title: "",
      key: "actions",
      sortable: false,
      width: 88,
    },
  ];

  if (props.showExpand) {
    headers.push({
      title: "",
      key: "data-table-expand",
      width: 10,
    });
  }

  return headers;
});

function editItem(item: unknown): void {
  currentIndex.value = props.modelValue.indexOf(item);

  showDialog.value = true;
}

function expandAll(v: Event): void {
  if (v) {
    expanded.value = props.modelValue;
  } else {
    expanded.value = [];
  }
}
</script>
<template>
  <v-data-table
    v-bind="$attrs"
    :items="modelValue"
    :search="search"
    :headers="fullHeaders"
    :show-expand="showExpand"
    v-model:expanded="expanded"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar>
        <v-toolbar-title>
          {{ name }}
        </v-toolbar-title>
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
                  class="mx-2"
                  v-bind="props"
                  @click="currentIndex = undefined"
                >
                  <v-icon color="primary">mdi-plus</v-icon>
                </v-btn>
              </template>

              <slot
                :close="() => (showDialog = false)"
                :value="
                  currentIndex !== undefined
                    ? modelValue[currentIndex]
                    : undefined
                "
              />
            </v-dialog>
          </template>
        </v-text-field>
      </v-toolbar>
    </template>

    <template #[`header.data-table-expand`]="{}">
      <v-checkbox
        false-icon="mdi-chevron-down"
        true-icon="mdi-chevron-up"
        @click:append="(v: Event) => expandAll(v)"
      />
    </template>

    <template #[`item.actions`]="{ item }">
      <v-icon small class="me-2" @click="editItem(item.raw)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="$emit('delete', item.raw)"> mdi-delete </v-icon>
    </template>

    <template #expanded-item="props">
      <slot name="expanded-item" v-bind="props" />
    </template>

    <template v-for="(_, name) in dataTableSlots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}" />
    </template>
  </v-data-table>
</template>

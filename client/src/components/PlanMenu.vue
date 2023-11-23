<script setup lang="ts">
import type { PlanClient } from "@/state/gardenStore";
import { useGardenStore } from "@/state/gardenStore";
import { ref } from "vue";
import EditPlan from "./EditPlan.vue";

const gardenStore = useGardenStore();

const showDialog = ref(false);
const newPlan = ref(false);

function edit(): void {
  newPlan.value = false;
  showDialog.value = true;
}
</script>
<template>
  <v-select
    :items="gardenStore.plans as PlanClient[]"
    item-title="name"
    item-value="id"
    return-object
    hide-details
    variant="outlined"
    :value="gardenStore.currentPlan"
    :model-value="gardenStore.currentPlan"
    @update:model-value="gardenStore.setCurrentPlan"
  >
    <template #selection="{ item }">
      <div class="text-h6 me-6">{{ item.title }}</div>
      <div class="text-medium-emphasis text-h6 font-weight-regular">
        {{ item.raw.year }}
      </div>
    </template>

    <template #item="{ item, props }">
      <v-list-item v-bind="props">
        <template #title="{ title }">
          <span class="me-6">{{ title }}</span>
          <span class="text-medium-emphasis">
            {{ item.raw.year }}
          </span>
        </template>
      </v-list-item>
    </template>
  </v-select>
  <v-btn icon>
    <v-icon @click="edit"> mdi-pencil </v-icon>
  </v-btn>

  <v-dialog v-model="showDialog" max-width="400" overlay-color="black">
    <template #activator="{ props }">
      <v-btn icon>
        <v-icon v-bind="props" @click="newPlan = true" color="primary"
          >mdi-plus</v-icon
        >
      </v-btn>
    </template>

    <EditPlan
      @close="showDialog = false"
      @input="gardenStore.editPlan"
      :value="newPlan ? undefined : gardenStore.currentPlan"
    />
  </v-dialog>
</template>

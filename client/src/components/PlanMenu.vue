<script setup lang="ts">
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
    :items="gardenStore.plans"
    item-title="name"
    item-value="id"
    return-object
    hide-details
    variant="outlined"
    v-model="gardenStore.currentPlan"
  >
    <template #selection="{ item }">
      <v-app-bar-title>{{ item.raw.name }}</v-app-bar-title>
    </template>
  </v-select>
  <v-btn icon>
    <v-icon @click="edit()"> mdi-pencil </v-icon>
  </v-btn>

  <v-dialog v-model="showDialog" max-width="400">
    <template #activator="{ props }">
      <v-btn icon>
        <v-icon v-bind="props" @click="newPlan = true" color="primary"
          >mdi-plus</v-icon
        >
      </v-btn>
    </template>

    <EditPlan
      @close="showDialog = false"
      @input="gardenStore.addPlan"
      :value="newPlan ? undefined : gardenStore.currentPlan"
    />
  </v-dialog>
</template>

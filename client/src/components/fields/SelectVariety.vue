<script setup lang="ts">
import { useGardenStore } from "../../state/gardenStore";
import type { Variety } from "@mendel/common";
import { computed } from "vue";
import PlantIcon from "../PlantIcon.vue";

const gardenStore = useGardenStore();

const props = defineProps<{
  disabled?: boolean;
  value?: Variety;
}>();

const varietyList = computed(() => {
  const list: (Variety | { divider: boolean })[] = [];

  let currentFamily: number | undefined;

  for (const variety of gardenStore.varieties) {
    if (currentFamily === undefined) {
      currentFamily = variety.familyId;
    }

    if (currentFamily !== undefined && variety.familyId !== currentFamily) {
      list.push({ divider: true });
      currentFamily = variety.familyId;
    }

    list.push(variety);
  }

  return list;
});

function varietyFilter(
  value: string,
  query: string,
  item?: { raw: Variety },
): boolean {
  if (!item) {
    return false;
  }

  return (
    `${item.raw.name} ${item.raw.family?.name}`
      .toLocaleLowerCase()
      .indexOf(query.toLocaleLowerCase()) > -1
  );
}
</script>
<template>
  <v-autocomplete
    :model-value="props.value"
    class="ms-3"
    auto-select-first
    :disabled="props.disabled"
    :items="varietyList"
    hide-details
    item-title="name"
    item-value="id"
    no-data-text="No plant varieties found"
    return-object
    :custom-filter="varietyFilter"
    @update:model-value="$emit('input', $event)"
  >
    <template #selection="{ item }">
      <template v-if="!('divider' in item.raw)">
        <plant-icon
          class="plantAvatar"
          :color="item.raw.color"
          :family-id="item.raw.familyId"
        />
        {{ item.raw.name }} - {{ item.raw.family?.name }}
      </template>
    </template>
    <template #item="{ item, props }">
      <v-divider v-if="'divider' in item.raw" />
      <v-list-item
        v-else
        v-bind="props"
        :title="item.raw.name"
        :subtitle="item.raw.family?.name"
      >
        <template #prepend>
          <v-avatar>
            <plant-icon
              :color="item.raw.color"
              :family-id="item.raw.familyId"
            />
          </v-avatar>
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<style scoped>
.v-icon.badge {
  height: 50%;
  width: 50%;
  position: absolute;
  display: block;
  right: 15%;
  bottom: 15%;
}
</style>

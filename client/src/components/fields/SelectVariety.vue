<script setup lang="ts">
import { useGardenStore } from "../../state/gardenStore";
import type { Variety } from "@mendel/common";
import { computed } from "vue";

const gardenStore = useGardenStore();

const props = defineProps<{
  disabled?: boolean;
  value?: Variety;
}>();

const varietyList = computed(() => {
  const list: (Variety | { divider: boolean })[] = [];

  for (const variety of gardenStore.varieties) {
    if (variety !== list[list.length - 1]) {
      list.push({ divider: true });
    }

    list.push(variety);
  }

  return list;
});

function varietyFilter(item: Variety, queryText: string): boolean {
  return (
    `${item.name} ${item.family?.name}`
      .toLocaleLowerCase()
      .indexOf(queryText.toLocaleLowerCase()) > -1
  );
}
</script>
<template>
  <v-select
    :model-value="props.value"
    class="ml-3"
    :disabled="props.disabled"
    :items="varietyList"
    hide-details
    item-title="name"
    item-value="id"
    no-data-text="No plant varieties found"
    return-object
    :filter="varietyFilter"
    @update:model-value="$emit('input', $event)"
  >
    <template #selection="{ item }">
      <svg class="icon avatar" :style="`fill: ${item.raw.color}`">
        <use :href="`#family-${item.raw.familyId}`" />
      </svg>
      {{ item.raw.name }} - {{ item.raw.family?.name }}
    </template>
    <template #item="{ item, props }">
      <v-divider v-if="item.raw.divider" />
      <v-list-item
        v-else
        v-bind="props"
        :title="item.raw.name"
        :subtitle="item.raw.family?.name"
      >
        <template #prepend>
          <v-avatar class="icon" :style="`fill: ${item.raw.color}`">
            <svg><use :href="`#family-${item.raw.familyId}`" /></svg>
          </v-avatar>
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>

<style scoped lang="scss">
.icon {
  stroke: black;
}

.avatar {
  height: 32px;
  width: 32px;
  margin-right: 8px;
}

.v-icon.badge {
  height: 50%;
  width: 50%;
  position: absolute;
  display: block;
  right: 15%;
  bottom: 15%;
}
</style>

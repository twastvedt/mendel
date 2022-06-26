<template>
  <v-select
    :value="value"
    class="ml-3"
    :disabled="disabled"
    :items="varietyList"
    hide-details
    item-text="name"
    item-value="id"
    no-data-text="No plant varieties found"
    return-object
    :filter="varietyFilter"
    @change="$emit('input', $event)"
  >
    <template #selection="{ item }">
      <svg class="icon avatar" :style="`fill: ${item.color}`">
        <use :href="`#family-${item.familyId}`" />
      </svg>
      {{ item.name }} - {{ item.family.name }}
    </template>

    <template #item="{ item }">
      <v-list-item-avatar class="icon" :style="`fill: ${item.color}`">
        <svg><use :href="`#family-${item.familyId}`" /></svg>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-text="item.name"></v-list-item-title>
        <v-list-item-subtitle v-text="item.family.name"></v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-select>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { state } from "../../state/State";
import { Variety } from "@mendel/common";

@Component({})
export default class Toolbar extends Vue {
  state = state;

  @Prop({ required: false })
  readonly disabled!: boolean;

  @Prop()
  readonly value!: Variety | null;

  get varietyList(): (Variety | { divider: boolean })[] {
    if (!this.state.db) {
      return [];
    }

    const list: (Variety | { divider: boolean })[] = [];

    for (const variety of this.state.db.varieties) {
      if (variety !== list[list.length - 1]) {
        list.push({ divider: true });
      }

      list.push(variety);
    }

    return list;
  }

  varietyFilter(item: Variety, queryText: string): boolean {
    return (
      `${item.name} ${item.family?.name}`
        .toLocaleLowerCase()
        .indexOf(queryText.toLocaleLowerCase()) > -1
    );
  }
}
</script>

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

<template>
  <v-container>
    <v-data-table :items="state.varieties" :headers="varietyHeaders">
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Store from "../Store";
import type { DataTableHeader } from "vuetify";

@Component({})
export default class SettingsPage extends Vue {
  state = Store.state;

  varietyHeaders: DataTableHeader[] = [
    {
      text: "Name",
      value: "name",
    },
    {
      text: "Color",
      value: "color",
    },
    {
      text: "Family",
      value: "familyId",
    },
    {
      text: "Plants",
      value: "plants.length",
    },
  ];

  async mounted(): Promise<void> {}
}
</script>

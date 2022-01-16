<template>
  <v-container>
    <EditDataTable
      v-model="state.varieties"
      name="Varieties"
      :headers="varietyHeaders"
      @delete="(item) => state.deleteVariety(item)"
    >
      <template #default="props">
        <EditVariety
          :value="props.value"
          @close="props.close"
          @input="(item) => state.editVariety(item)"
        />
      </template>

      <template #item.plants="{ item }">
        {{ item.plants ? item.plants.length : 0 }}
      </template>

      <template #item.color="{ item }">
        <svg class="svgicon" style="height: 32px; width: 32px">
          <use :href="`#family-${item.family.id}`" :fill="item.color" />
        </svg>
      </template>
    </EditDataTable>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Store from "../Store";
import type { DataTableHeader } from "vuetify";
import EditVariety from "./EditVariety.vue";
import EditDataTable from "./EditDataTable.vue";

@Component({
  components: {
    EditVariety,
    EditDataTable,
  },
})
export default class VarietySettings extends Vue {
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
      value: "family.name",
    },
    {
      text: "Plants",
      value: "plants",
    },
  ];

  async mounted(): Promise<void> {}
}
</script>

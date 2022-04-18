<template>
  <v-container v-if="state.garden">
    <EditDataTable
      v-model="state.garden.varieties"
      name="Varieties"
      :headers="varietyHeaders"
      @delete="(item) => state.garden.deleteVariety(item)"
    >
      <template #default="props">
        <EditVariety
          :value="props.value"
          @close="props.close"
          @input="(item) => state.garden.editVariety(item)"
        />
      </template>

      <template #[`item.plants`]="{ item }">
        {{ plantCount(item) }}
      </template>

      <template #[`item.color`]="{ item }">
        <svg class="svgicon" style="height: 32px; width: 32px">
          <use :href="`#family-${item.family.id}`" :fill="item.color" />
        </svg>
      </template>
    </EditDataTable>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { state } from "../Store";
import type { DataTableHeader } from "vuetify";
import EditVariety from "./EditVariety.vue";
import EditDataTable from "./EditDataTable.vue";
import { Variety } from "@mendel/common";

@Component({
  components: {
    EditVariety,
    EditDataTable,
  },
})
export default class VarietySettings extends Vue {
  state = state;

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

  plantCount(variety: Variety): number | undefined {
    return state.garden?.plantCount({ varietyId: variety.id });
  }
}
</script>

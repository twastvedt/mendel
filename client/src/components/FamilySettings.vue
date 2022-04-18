<template>
  <v-container v-if="state.garden">
    <EditDataTable
      v-model="state.garden.families"
      name="Families"
      :headers="headers"
      @delete="deleteFamily"
    >
      <template #default="props">
        <EditFamily
          :value="props.value"
          @close="props.close"
          @input="(item) => state.garden.editFamily(item)"
        />
      </template>

      <template #[`item.plants`]="{ item }">
        {{ plantCount(item) }}
      </template>

      <template #[`item.color`]="{ item }">
        <svg class="svgicon" style="height: 32px; width: 32px">
          <use :href="`#family-${item.id}`" :fill="item.color" />
        </svg>
      </template>
    </EditDataTable>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { state } from "../Store";
import type { DataTableHeader } from "vuetify";
import EditFamily from "./EditFamily.vue";
import EditDataTable from "./EditDataTable.vue";
import { Family } from "@mendel/common";

@Component({
  components: {
    EditFamily,
    EditDataTable,
  },
})
export default class FamilySettings extends Vue {
  state = state;

  headers: DataTableHeader[] = [
    {
      text: "Name",
      value: "name",
    },
    {
      text: "Color",
      value: "color",
    },
    {
      text: "Spacing",
      value: "spacing",
    },
    {
      text: "Nitrogen",
      value: "nitrogen",
    },
    {
      text: "Plants",
      value: "plants",
    },
  ];

  plantCount(family: Family): number | undefined {
    return state.garden?.plantCount({ familyId: family.id });
  }

  async deleteFamily(family: Family): Promise<void> {
    const varieties =
      family.varieties?.length ??
      state.garden?.varieties.filter((v) => v.familyId === family.id).length;

    if (varieties) {
      alert(`Can't delete family which still has ${varieties} varietie(s).`);
    } else {
      state.garden?.deleteFamily(family);
    }
  }
}
</script>

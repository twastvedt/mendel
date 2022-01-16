<template>
  <v-container>
    <EditDataTable
      v-model="state.families"
      name="Families"
      :headers="headers"
      @delete="deleteFamily"
    >
      <template #default="props">
        <EditFamily
          :value="props.value"
          @close="props.close"
          @input="(item) => state.editFamily(item)"
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
import Store from "../Store";
import type { DataTableHeader } from "vuetify";
import EditFamily from "./EditFamily.vue";
import EditDataTable from "./EditDataTable.vue";
import { Family } from "@/entity/Family";

@Component({
  components: {
    EditFamily,
    EditDataTable,
  },
})
export default class FamilySettings extends Vue {
  state = Store.state;

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

  async mounted(): Promise<void> {}

  plantCount(family: Family): number | undefined {
    return this.state.garden?.plants.filter(
      (p) => p.variety?.family?.id === family.id
    ).length;
  }

  async deleteFamily(family: Family): Promise<void> {
    const varieties =
      family.varieties?.length ??
      this.state.varieties.filter((v) => v.familyId === family.id).length;

    if (varieties) {
      alert(`Can't delete family which still has ${varieties} varietie(s).`);
    } else {
      this.state.deleteFamily(family);
    }
  }
}
</script>

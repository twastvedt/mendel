<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Varieties</v-card-title>
          <v-data-table
            v-if="state.db"
            :items="state.db.varieties"
            name="Varieties"
            :headers="headers"
          >
            <template #[`item.plants`]="{ item }">
              {{ plantCount(item) }}
            </template>

            <template #[`item.name`]="{ item }">
              <svg class="icon avatar" :style="`fill: ${item.color}`">
                <use :href="`#family-${item.familyId}`" />
              </svg>
              {{ item.name }}
              <!-- <v-list-item-avatar class="icon" :style="`fill: ${item.color}`">
          <svg><use :href="`#family-${item.familyId}`" /></svg>
        </v-list-item-avatar>
        <v-list-item-title v-text="item.name"></v-list-item-title> -->
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Areas</v-card-title>
          <v-simple-table>
            <template #default>
              <tbody>
                <tr v-for="(value, key) in areas" :key="key">
                  <td>{{ key }}</td>
                  <td v-if="value !== undefined">
                    {{ Math.round(value).toLocaleString() }} sq. ft.
                  </td>
                  <td v-else>-</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { state } from "../state/State";
import type { DataTableHeader } from "vuetify";
import EditDataTable from "./EditDataTable.vue";
import { polygonArea } from "d3-polygon";
import { bboxArea, polygonBounds } from "../geometry/polygonTools";
import { Variety } from "@mendel/common";

@Component({
  components: {
    EditDataTable,
  },
})
export defineComponent({
  name: "Summary",
  state = state;

  headers: DataTableHeader[] = [
    {
      text: "Name",
      value: "name",
    },
    {
      text: "Family",
      value: "family.name",
    },
    {
      text: "Spacing",
      value: "spacing",
    },
    {
      text: "Plants",
      value: "plants",
    },
  ];

  areas = {
    Beds:
      (state.db?.garden.beds.reduce(
        (total, bed) => total + polygonArea(bed.shape.coordinates[0]),
        0
      ) ?? 0) / 144,
    Total: this.totalArea,
  };

  plantCount(variety: Variety): number | undefined {
    return state.db?.plantCount({ varietyId: variety.id });
  }

  get totalArea(): number | undefined {
    const beds = state.db?.garden.beds;

    if (beds) {
      return (
        bboxArea(
          beds.reduce(
            (bounds, bed) => polygonBounds(bed.shape.coordinates[0], bounds),
            [
              ...beds[0].shape.coordinates[0][0],
              ...beds[0].shape.coordinates[0][1],
            ]
          )
        ) / 144
      );
    }

    return undefined;
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
  vertical-align: middle;
}
</style>

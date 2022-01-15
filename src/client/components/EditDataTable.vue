<template>
  <v-card>
    <v-card-title>
      {{ name }}
      <v-spacer />
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        clearable
        single-line
        hide-details
      >
        <template #append-outer>
          <v-dialog v-model="showDialog">
            <template #activator="{ on }">
              <v-btn
                fab
                small
                class="mx-2"
                v-on="on"
                @click="currentIndex = null"
              >
                <v-icon color="primary">mdi-plus</v-icon>
              </v-btn>
            </template>

            <slot
              :close="() => (showDialog = false)"
              :value="currentIndex !== null ? value[currentIndex] : undefined"
            />
          </v-dialog>
        </template>
      </v-text-field>
    </v-card-title>

    <v-data-table
      v-bind="$attrs"
      :items="value"
      :search="search"
      :headers="fullHeaders"
      :show-expand="showExpand"
      :expanded.sync="expanded"
    >
      <template #header.data-table-expand="{}">
        <v-checkbox
          off-icon="mdi-chevron-down"
          on-icon="mdi-chevron-up"
          @change="(v) => expandAll(v)"
        />
      </template>

      <template #item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small class="mr-2" @click="$emit('delete', item)">
          mdi-delete
        </v-icon>
      </template>

      <template #expanded-item="props">
        <slot name="expanded-item" v-bind="props" />
      </template>

      <template v-for="(index, name) in $slots" #[name]>
        <slot :name="name" />
      </template>

      <template v-for="(index, name) in $scopedSlots" #[name]="data">
        <slot :name="name" v-bind="data" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import type { DataTableHeader } from "vuetify";

@Component({})
export default class EditDataTable extends Vue {
  @Prop()
  value!: unknown[];

  @Prop()
  name!: string;

  @Prop()
  headers!: DataTableHeader[];

  @Prop({ default: false })
  showExpand?: boolean;

  expanded = [] as unknown[];

  search = "";
  showDialog = false;
  currentIndex = null as number | null;

  get fullHeaders(): DataTableHeader[] {
    const headers: DataTableHeader[] = [
      ...this.headers,
      {
        text: "",
        value: "actions",
        align: "end",
        groupable: false,
        sortable: false,
        cellClass: "smallColumn",
      },
    ];

    if (this.showExpand) {
      headers.push({
        text: "",
        value: "data-table-expand",
        cellClass: "smallColumn",
      });
    }

    return headers;
  }

  editItem(item: unknown): void {
    this.currentIndex = this.value.indexOf(item);

    this.showDialog = true;
  }

  expandAll(v: boolean): void {
    if (v) {
      this.expanded = this.value;
    } else {
      this.expanded = [];
    }
  }
}
</script>
<style>
.smallColumn {
  width: 1px;
  white-space: nowrap;
}
</style>

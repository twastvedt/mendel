<template>
  <v-card>
    <v-card-text>
      <v-form ref="form">
        <v-text-field
          v-model="newName"
          label="Name"
          dense
          required
        ></v-text-field>
        <v-select
          v-model="newFamily"
          :items="state.varietiesByFamily"
          item-text="name"
          item-value="id"
          label="Family"
          persistent-hint
          return-object
          dense
          required
        ></v-select>
        <v-text-field v-model="newColor" label="Color" dense required>
          <template #append
            ><v-menu :close-on-content-click="false" :offset-y="true">
              <template #activator="{ on, attrs }">
                <v-btn
                  v-show="newFamily"
                  small
                  v-bind="attrs"
                  class="icon"
                  :style="`fill: ${newColor}`"
                  v-on="on"
                  v-html="newFamily ? newFamily.icon : ''"
                ></v-btn>
              </template>
              <v-card>
                <v-color-picker
                  v-model="newColor"
                  dot-size="25"
                  hide-inputs
                  mode="hexa"
                  swatches-max-height="200"
                ></v-color-picker>
              </v-card> </v-menu></template
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="newVariety"> + </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

import { Family } from "@/entity/Family";
import Store from "../Store";

@Component({})
export default class AddNewVariety extends Vue {
  $refs!: {
    form: HTMLFormElement;
  };

  state = Store.state;

  families: Family[] = [];
  newName = "";
  newColor = "#FFFFFF";
  newFamily: Family | null = null;

  @Watch("newFamily")
  onNewFamilyChanged(val: { color: string }): void {
    this.newColor = val.color;
  }

  async newVariety(): Promise<void> {
    if (this.$refs.form.validate()) {
      this.state.addVariety(
        this.newName,
        this.newColor,
        (this.newFamily as Family).id
      );

      this.newName = "";
      this.newColor = this.newFamily?.color ?? this.newColor;
    }
  }
}
</script>

<style scoped lang="scss">
.icon {
  stroke: black;
}
</style>

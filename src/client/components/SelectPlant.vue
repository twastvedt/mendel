<template>
  <v-item-group>
    <v-container>
      <v-row align="stretch">
        <template v-for="family in varieties">
          <v-col cols="6" v-for="variety in family.varieties" :key="variety.id">
            <SeedPack :variety="variety" />
          </v-col>
        </template>
        <v-col cols="6">
          <v-card class="seedPack new">
            <h1
              class="newButton"
              :hidden="showNewForm"
              @click="showNewForm = true"
            >
              +
            </h1>
            <v-card-text :hidden="!showNewForm" @blur="showNewForm = false">
              <v-text-field v-model="newName" label="Name" dense></v-text-field>
              <v-select
                v-model="newFamily"
                :items="varieties"
                item-text="name"
                item-value="id"
                label="Family"
                persistent-hint
                return-object
                dense
              ></v-select>
              <v-text-field
                v-model="newColor"
                label="Color"
                mask="!#XXXXXXXX"
                dense
              ></v-text-field>
              <v-menu :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-responsive aspect-ratio="1/1">
                    <v-btn
                      :color="newColor"
                      small
                      v-on="on"
                      v-bind="attrs"
                    ></v-btn>
                  </v-responsive>
                </template>
                <v-card>
                  <v-color-picker
                    dot-size="25"
                    hide-inputs
                    mode="hexa"
                    swatches-max-height="200"
                    v-model="newColor"
                  ></v-color-picker>
                </v-card>
              </v-menu>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import SeedPack from "./SeedPack.vue";
import { request } from "../ApiRequest";
import { varietyApi } from "@/api/VarietyApi";
import { Family } from "@/entity/Family";
import { Variety } from "@/entity/Variety";

@Component({
  components: {
    SeedPack,
  },
  props: {
    msg: String,
  },
})
export default class SelectPlant extends Vue {
  loading = false;
  error = "";
  varieties: Family[] = [];
  showNewForm = false;
  newName = "";
  newColor = "#FFFFFF";
  newFamily: Family | null = null;

  mounted(): void {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    this.error = "";
    this.loading = true;

    try {
      this.varieties = await request(
        varietyApi.allByFamily,
        undefined,
        undefined
      );

      this.varieties.forEach((f) => f.varieties.forEach((v) => (v.family = f)));
    } catch (error) {
      this.error = error;
    }

    this.loading = false;
  }
}
</script>

<style scoped lang="scss">
@import "../styles/variables.scss";

.new {
  h1 {
    text-align: center;
    font-size: 3em;
    font-family: sans-serif;
    font-weight: bold;
  }
}

.v-card {
  height: 100%;
}
</style>

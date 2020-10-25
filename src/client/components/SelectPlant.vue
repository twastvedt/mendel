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
          <v-card class="seedPack new"><h1>+</h1></v-card>
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
  showNew = false;

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

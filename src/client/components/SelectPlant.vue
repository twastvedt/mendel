<template>
  <div class="selectPlant container">
    <template v-for="family in varieties">
      <SeedPack
        v-for="variety in family.varieties"
        :key="variety.id"
        :variety="variety"
      />
    </template>
    <div class="seedPack new"><h1>+</h1></div>
  </div>
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

.selectPlant {
  display: flex;
}

.seedPack {
  margin: $s;
  width: 6em;
  height: 9em;
  box-sizing: border-box;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.25);
  border-radius: 1px;

  &.new {
    background-color: white;

    h1 {
      text-align: center;
      font-size: 3em;
      font-family: sans-serif;
      font-weight: bold;
    }
  }
}
</style>

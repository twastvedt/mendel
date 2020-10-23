<template class="container">
  <div class="selectPlant container">
    <div v-for="family in varieties" :key="family.id">
      <SeedPack
        v-for="variety in family.varieties"
        :key="variety.id"
        :variety="variety"
      />
    </div>
    <div>+</div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import SeedPack from "./SeedPack.vue";
import { request } from "../ApiRequest";
import { varietyApi } from "@/api/VarietyApi";
import { Family } from "@/entity/Family";

@Options({
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
.selectPlant {
  display: flex;
}
</style>

<template class="container">
  <div class="selectPlant container">
    <SeedPack
      v-for="variety in varieties"
      :key="variety.id"
      :variety="variety"
    />
    <div>+</div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import SeedPack from "./SeedPack";
import { Variety } from "../../entity/Variety";
import { request } from "../ApiRequest";
import { varietyApi } from "../../api/VarietyApi";

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
  varieties: Variety[] = [];

  mounted(): void {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    this.error = "";
    this.loading = true;

    try {
      this.varieties = await request(varietyApi.all, undefined, undefined);
    } catch (error) {
      this.error = error;
    }

    this.loading = false;
  }
}
</script>

<style scoped lang="scss">
@import "../styles/style.scss";

.selectPlant {
  display: flex;
}

.seedPack {
  width: 2em;
  height: 3em;
  margin: $s;
  background: white;
  flex: 0 0 auto;
}
</style>

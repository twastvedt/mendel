<template>
  <SelectPlant />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import SelectPlant from "./SelectPlant.vue";

@Options({
  components: {
    SelectPlant,
  },
})
export default class Sidebar extends Vue {}
</script>

<style scoped lang="scss">
@import "../styles/style.scss";
</style>

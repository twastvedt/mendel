<template>
  <SelectPlant />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SelectPlant from "./SelectPlant.vue";

@Component({
  components: {
    SelectPlant,
  },
})
export default class Sidebar extends Vue {}
</script>

<style scoped lang="scss"></style>

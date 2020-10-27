<template>
  <v-list dense>
    <v-list-item-group>
      <template v-for="family in state.varieties">
        <v-list-item v-for="variety in family.varieties" :key="variety.id">
          <v-list-item-icon>
            <v-list-item-avatar
              class="icon"
              :style="`fill: ${variety.color}`"
              v-html="family.icon"
            ></v-list-item-avatar>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="variety.name"></v-list-item-title>
            <v-list-item-subtitle v-text="family.name"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list-item-group>

    <v-list-item class="new">
      <v-list-item-content>
        <AddNewVariety v-show="!showNewForm" @blur="showNewForm = false" />
        <v-btn @click="showNewForm = true" v-show="showNewForm"> + </v-btn>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Store from "../Store";
import AddNewVariety from "./AddNewVariety.vue";

@Component({
  components: {
    AddNewVariety,
  },
})
export default class SelectPlant extends Vue {
  $refs!: {
    form: HTMLFormElement;
  };

  state = Store.state;

  showNewForm = false;

  mounted(): void {
    this.state.loadVarieties();
  }
}
</script>

<style scoped lang="scss">
@import "../styles/variables.scss";

.icon {
  stroke: black;
}

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

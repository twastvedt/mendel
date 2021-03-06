<template>
  <v-list dense>
    <v-list-item-group v-model="selected">
      <template v-for="family in state.varietiesByFamily">
        <v-list-item
          v-for="variety in family.varieties"
          :key="variety.id"
          :value="variety.id"
          @click="onSelected(variety.id)"
        >
          <v-list-item-icon>
            <v-list-item-avatar class="icon" :style="`fill: ${variety.color}`">
              <svg><use :href="`#family-${family.id}`" /></svg>
            </v-list-item-avatar>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="variety.name"></v-list-item-title>
            <v-list-item-subtitle v-text="family.name"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list-item-group>

    <v-list-item>
      <v-list-item-content>
        <AddNewVariety v-show="!showNewForm" @blur="showNewForm = false" />
        <v-btn v-show="showNewForm" @click="showNewForm = true"> + </v-btn>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Store, { Action } from "../Store";
import AddNewVariety from "./AddNewVariety.vue";

@Component({
  components: {
    AddNewVariety,
  },
})
export default class SelectPlant extends Vue {
  state = Store.state;

  showNewForm = false;

  selected: number | [] = [];

  mounted(): void {
    this.state.loadVarieties();
  }

  onSelected(varietyId: number): void {
    this.state.setAction(Action.DrawPlant, varietyId);
  }

  @Watch(nameof.full(SelectPlant.prototype.state.action, -2))
  @Watch(nameof.full(SelectPlant.prototype.state.actionId, -2))
  newActionId(): void {
    if (
      (this.state.action === Action.DrawPlant ||
        this.state.action === Action.DrawPlanting) &&
      this.state.actionId
    ) {
      this.selected = this.state.actionId;
    } else {
      this.selected = [];
    }
  }
}
</script>

<style scoped lang="scss">
@import "../styles/variables.scss";

.icon {
  stroke: black;
}

.v-card {
  height: 100%;
}
</style>

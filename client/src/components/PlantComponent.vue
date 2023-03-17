<template>
  <g
    :class="interactive ? 'interactive' : 'non-interactive'"
    @click="$emit('click', $event)"
  >
    <template v-if="state.scaleRange > 1">
      <circle
        v-if="drawSpacing"
        :r="family.spacing / 2"
        class="spacingCircle"
      />
      <use
        :width="iconSize"
        :height="iconSize"
        :x="-iconSize / 2"
        :y="-iconSize / 2"
        :href="`#family-${family.id}`"
        :fill="variety.color"
        class="icon"
      />
    </template>

    <circle
      v-else
      :r="family.spacing / 2"
      :fill="variety.color"
      class="solidCircle"
    />

    <title>{{ title }}</title>
  </g>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { state } from "../state/State";
import { Family, Variety } from "@mendel/common";

@Component({})
export defineComponent({
  name: "PlantComponent",
  @Prop() readonly variety!: Variety;
  @Prop({ default: true }) readonly drawSpacing!: boolean;
  @Prop({ default: true }) readonly interactive!: boolean;

  get family(): Family {
    if (this.variety.family) {
      return this.variety.family;
    }

    throw new Error("Variety has no family");
  }

 iconSize(): number {
    return Math.min(40 / state.scale, (this.family.spacing * 2) / 3);
  }

  get title(): string {
    return `${this.variety.name} ${this.family.name}`;
  }

  state = state;
}
</script>

<style scoped lang="scss">
.interactive {
  pointer-events: auto;
}
.non-interactive {
  pointer-events: none;
}

.solidCircle {
  opacity: 75%;
  stroke: none;
}

.solidCircle:hover {
  opacity: 90%;
}

.spacingCircle {
  fill: gray;
  fill-opacity: 0;
  stroke: gray;
  stroke-dasharray: 5 5;
}

.spacingCircle:hover {
  fill-opacity: 0.5;
}

.icon {
  pointer-events: none;
}
</style>

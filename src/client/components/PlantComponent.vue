<template>
  <g :class="classList" @click="onClick">
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

    <title v-if="interactive">{{ title }}</title>
  </g>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Store from "../Store";
import { Family } from "@/entity/Family";
import { Variety } from "@/entity/Variety";

@Component({})
export default class PlantComponent extends Vue {
  @Prop() readonly variety!: Variety;
  @Prop({ default: false }) readonly interactive!: boolean;
  @Prop({ default: true }) readonly drawSpacing!: boolean;

  get family(): Family {
    if (this.variety.family) {
      return this.variety.family;
    }

    throw new Error("Variety has no family");
  }

  get iconSize(): number {
    return Math.min(40 / this.state.scale, (this.family.spacing * 2) / 3);
  }

  get title(): string {
    return `${this.variety.name} ${this.family.name}`;
  }

  get classList(): Record<string, unknown> {
    return { interactive: this.interactive, notInteractive: !this.interactive };
  }

  state = Store.state;

  onClick(event: PointerEvent): void {
    if (this.interactive) {
      this.$emit("click", event);
    }
  }
}
</script>

<style scoped lang="scss">
.solidCircle {
  opacity: 75%;
  stroke: none;
}

.interactive .solidCircle:hover {
  opacity: 90%;
}

.spacingCircle {
  fill: gray;
  fill-opacity: 0;
  stroke: gray;
  stroke-dasharray: 5 5;
}

.interactive .spacingCircle:hover {
  fill-opacity: 0.5;
}

.notInteractive,
.icon {
  pointer-events: none;
}
</style>

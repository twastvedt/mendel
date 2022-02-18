<template>
  <svg
    id="map"
    ref="map"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    @mousemove="onMouseMove"
    @click="onClick"
    @mouseleave="onHover"
  >
    <g ref="content" class="content">
      <g v-if="state.garden">
        <g v-for="(bed, i) in state.garden.beds" :key="`${bed.id}-bed`">
          <path
            class="bed"
            :style="elementStyle('bed')"
            :d="state.pathGenerator(bed.shape)"
            @click="onClick($event, bed)"
            @mouseenter="onHover($event, bed, i)"
            @mouseleave="onHover($event)"
          />

          <!-- <circle
            v-for="(point, i) in bed.shape.coordinates[0]"
            :key="`p${i}`"
            :cx="point[0]"
            :cy="point[1]"
            r="0.5"
          /> -->
        </g>

        <PlantingComponent
          v-for="(planting, index) in state.garden.plantings"
          :key="`${index}-planting`"
          :planting="planting"
          :style="elementStyle('planting')"
          @click="onClick($event, planting)"
          @mouseover="onHover($event, planting, index)"
          @mouseleave="onHover($event)"
        />

        <PlantComponent
          v-for="(plant, index) in state.garden.plants"
          :key="`${index}-plant`"
          :transform="state.makeTransform(plant.location.coordinates)"
          :variety="plant.variety"
          :style="elementStyle('plant')"
          @click="onClick($event, plant)"
          @mouseover="onHover($event, plant, index)"
          @mouseleave="onHover($event)"
        />

        <dynamic
          :is="state.tool.cursorComponent"
          v-if="state.tool && state.tool.cursorComponent"
          v-bind="state.tool.cursorProps"
        />
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ElementType, state } from "../Store";
import * as d3 from "d3";
import { zoom, D3ZoomEvent } from "d3-zoom";

import PlantComponent from "./PlantComponent.vue";
import PlantingComponent from "./PlantingComponent.vue";
import { EntityBase } from "@/entity/EntityBase";
import { Position } from "@/entity/geoJson";

@Component({
  components: {
    PlantComponent,
    PlantingComponent,
  },
})
export default class GardenMap extends Vue {
  $refs!: {
    map: SVGSVGElement;
    content: SVGGElement;
  };

  state = state;

  zoom!: d3.ZoomBehavior<SVGSVGElement, unknown>;

  zoomed(e: D3ZoomEvent<SVGSVGElement, unknown>): void {
    this.content.attr("transform", e.transform as any);

    state.scale = e.transform.k;
  }

  content!: d3.Selection<SVGGElement, unknown, null, undefined>;
  svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  async mounted(): Promise<void> {
    console.debug("Map mounted");

    await state.ready;

    if (!state.garden) {
      return;
    }

    this.svg = d3.select(this.$refs.map);

    const width = this.$refs.map.clientWidth,
      height = this.$refs.map.clientHeight;

    d3.select(this.$refs.map).attr("viewBox", [0, 0, width, height] as any);

    this.content = d3.select(this.$refs.content);

    state.cursor = this.content.append("g").classed("cursor", true);

    this.zoom = zoom<SVGSVGElement, unknown>().on(
      "zoom",
      this.zoomed.bind(this)
    );

    this.svg.call(this.zoom);

    Vue.nextTick(() => this.zoomFit(false));
  }

  zoomFit(animate: boolean): void {
    const bounds = this.$refs.content.getBBox();

    if (bounds) {
      const width = this.$refs.map.clientWidth,
        height = this.$refs.map.clientHeight,
        midX = bounds.x + bounds.width / 2,
        midY = bounds.y + bounds.height / 2;

      const scale =
          0.9 / Math.max(bounds.width / width, bounds.height / height),
        translate = [width / 2 - scale * midX, height / 2 - scale * midY];

      let zoomable;

      if (animate) {
        zoomable = this.svg.transition().duration(750);
      } else {
        zoomable = this.svg;
      }

      zoomable.call(
        this.zoom.transform,
        d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
      );
    }
  }

  onClick(event: MouseEvent, element?: EntityBase): void {
    state.onClick(element);
  }

  onHover(event: MouseEvent, element?: EntityBase, index?: number): void {
    state.tool?.OnHover?.(state.cursorPosition, element, index);
  }

  onMouseMove(event: MouseEvent): void {
    const point = d3.pointer(event, this.content.node());
    point[1] = -point[1];

    [...state.cursorPosition] = point;

    if (state.tool) {
      state.updateTool(point);
    }
  }

  elementStyle(elementType: ElementType): Record<string, string> {
    return {
      "pointer-events":
        !state.tool || state.tool?.interactiveElements?.has(elementType)
          ? "auto"
          : "none",
    };
  }
}
</script>

<style scoped lang="scss">
#map {
  width: 100%;
  height: 100%;
  display: block;
  z-index: 0;

  &::v-deep * {
    vector-effect: non-scaling-stroke;
  }
}

::v-deep .bed {
  fill: rgba($color: #ffffff, $alpha: 0.5);
  stroke: #000000;
  stroke-width: 1px;
}
</style>

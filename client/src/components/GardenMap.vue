<template>
  <v-layout class="mapContainer">
    <Toolbar class="ma-3 toolbar" />

    <svg
      id="map"
      ref="map"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      @mousemove="onMouseMove"
      @click="state.onClick($event)"
      @mouseleave="onHover"
    >
      <g ref="content" class="content">
        <g v-if="state.db">
          <g v-for="(bed, i) in state.db.garden.beds" :key="bed.id">
            <path
              class="bed"
              :style="elementStyle('bed')"
              :d="state.pathGenerator(bed.shape)"
              @click.stop="state.onClick($event, { type: 'bed', item: bed })"
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

          <g v-if="state.db.grid">
            <path
              v-for="(area, i) in state.db.grid.areas"
              :key="i"
              class="area"
              :style="elementStyle('area')"
              :d="state.pathFromPoints(area.polygon)"
              @click.stop="state.onClick($event, { type: 'area', item: area })"
              @mouseenter="onHover($event, area, i)"
              @mouseleave="onHover($event)"
            />
          </g>

          <PlantingComponent
            v-for="(planting, index) in state.db.garden.plantings"
            :key="`${index}-planting`"
            :planting="planting"
            :plants-interactive="isInteractive('plant')"
            :style="elementStyle('planting')"
            @click.stop="
              state.onClick($event, { type: 'planting', item: planting })
            "
            @mouseover="onHover($event, planting, index)"
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

    <v-navigation-drawer
      v-if="state.selection.length"
      width="300"
      right
      absolute
      permanent
    >
      <DetailsPane />
    </v-navigation-drawer>

    <v-footer app>
      <template v-if="state.tool">
        {{ state.tool.helpText }}
      </template>
      <v-spacer />
      {{
        state.cursorPosition.map((c) => Math.round(c * 100) / 100).join(", ")
      }}
    </v-footer>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { state } from "../state/State";
import * as d3 from "d3";
import { zoom, D3ZoomEvent } from "d3-zoom";

import PlantingComponent from "./PlantingComponent.vue";
import Toolbar from "./Toolbar.vue";
import DetailsPane from "./DetailsPane.vue";
import { UiElementType } from "../types/entityTypes";

@Component({
  components: {
    Toolbar,
    PlantingComponent,
    DetailsPane,
  },
})
export defineComponent({
  name: "GardenMap",
  $refs!: {
    map: SVGSVGElement;
    content: SVGGElement;
  };

  state = state;

  zoom!: d3.ZoomBehavior<SVGSVGElement, unknown>;

  zoomed(e: D3ZoomEvent<SVGSVGElement, unknown>): void {
    this.$refs.content.setAttribute(
      "transform",
      e.transform as unknown as string
    );

    state.scale = e.transform.k;
  }

  svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  async mounted(): Promise<void> {
    console.debug("Map mounted");

    await state.ready;

    if (!state.db) {
      return;
    }

    this.svg = d3.select(this.$refs.map);

    const width = this.$refs.map.clientWidth,
      height = this.$refs.map.clientHeight;

    d3.select(this.$refs.map).attr("viewBox", [
      0,
      0,
      width,
      height,
    ] as unknown as string);

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

  onHover(event: MouseEvent, element?: unknown, index?: number): void {
    state.tool?.onHover?.(state.cursorPosition, index, element);
  }

  onMouseMove(event: MouseEvent): void {
    const point = d3.pointer(event, this.$refs.content);
    point[1] = -point[1];

    [...state.cursorPosition] = point;

    if (state.tool) {
      state.updateTool(point);
    }
  }

  isInteractive(elementType: UiElementType): boolean {
    return (
      (!state.tool || state.tool?.interactiveElements?.has(elementType)) ??
      false
    );
  }

  elementStyle(elementType: UiElementType): Record<string, string> {
    return {
      "pointer-events": this.isInteractive(elementType) ? "auto" : "none",
    };
  }
}
</script>

<style scoped lang="scss">
.mapContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.toolbar {
  position: absolute;
  left: 0;
}

#map {
  width: 100%;
  flex: 1 0 auto;
  display: block;

  &::v-deep * {
    vector-effect: non-scaling-stroke;
  }
}

.bed {
  fill: rgba($color: #ffffff, $alpha: 0.5);
  stroke: #000000;
  stroke-width: 1px;
}

.area {
  fill: rgba($color: #ffffff, $alpha: 0.15);
  stroke: #999999;
  stroke-dasharray: 5;
  mix-blend-mode: multiply;
}
</style>

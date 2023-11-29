<script setup lang="ts">
import { useRootStore } from "../state/rootStore";
import { useGardenStore } from "../state/gardenStore";
import * as d3 from "d3";
import { zoom } from "d3-zoom";
import type { D3ZoomEvent } from "d3-zoom";

import PlantingComponent from "./PlantingComponent.vue";
import MapToolbar from "./MapToolbar.vue";
import DetailsPane from "./DetailsPane.vue";
import type { AreaElement, UiElementType } from "../types/entityTypes";
import { nextTick, onMounted, ref } from "vue";
import { pathGenerator, pathFromPoints } from "@/services/projection";
import { BackgroundImage } from "@/services/canvasManager";

const pathGeneratorLocal = pathGenerator;
const pathFromPointsLocal = pathFromPoints;

const store = useRootStore();
const gardenStore = useGardenStore();

const map = ref<SVGSVGElement>();
const content = ref<SVGGElement>();

let zoomBehavior!: d3.ZoomBehavior<SVGSVGElement, unknown>;
let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

let backgroundImage = ref(new BackgroundImage());

gardenStore.ready.then(() => {
  backgroundImage.value.update();
});

function zoomed(e: D3ZoomEvent<SVGSVGElement, unknown>): void {
  if (
    content.value &&
    !isNaN(e.transform.x) &&
    !isNaN(e.transform.y) &&
    isFinite(e.transform.k)
  ) {
    content.value.setAttribute("transform", e.transform as unknown as string);

    store.scale = e.transform.k;
  }
}

onMounted(async (): Promise<void> => {
  console.debug("Map mounted");

  await gardenStore.ready;

  if (!map.value) {
    return;
  }

  svg = d3.select(map.value);

  const width = map.value.clientWidth,
    height = map.value.clientHeight;

  d3.select(map.value).attr("viewBox", [
    0,
    0,
    width,
    height,
  ] as unknown as string);

  zoomBehavior = zoom<SVGSVGElement, unknown>().on("zoom", zoomed.bind(this));

  svg.call(zoomBehavior);

  nextTick(() => zoomFit(false));
});

function zoomFit(animate: boolean): void {
  const bounds = content.value?.getBBox();

  if (bounds && map.value) {
    const width = map.value.clientWidth,
      height = map.value.clientHeight,
      midX = bounds.x + bounds.width / 2,
      midY = bounds.y + bounds.height / 2;

    const scale = 0.9 / Math.max(bounds.width / width, bounds.height / height),
      translate = [width / 2 - scale * midX, height / 2 - scale * midY];

    let zoomable;

    if (animate) {
      zoomable = svg.transition().duration(750);
    } else {
      zoomable = svg;
    }

    zoomable.call(
      zoomBehavior.transform,
      d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale),
    );
  }
}

function onHover(event: MouseEvent, element?: unknown, index?: number): void {
  store.tool?.onHover?.(store.cursorPosition, index, element);
}

function onMouseMove(event: MouseEvent): void {
  const point = d3.pointer(event, content.value);
  point[1] = -point[1];

  [...store.cursorPosition] = point;

  if (store.tool) {
    store.updateTool(point);
  }
}

function isInteractive(elementType: UiElementType): boolean {
  return (
    (!store.tool || store.tool?.interactiveElements?.has(elementType)) ?? false
  );
}

function elementStyle(elementType: UiElementType): Record<string, string> {
  return {
    "pointer-events": isInteractive(elementType) ? "auto" : "none",
  };
}
</script>
<template>
  <v-layout class="mapContainer bg-mapBackground">
    <MapToolbar class="ma-3 toolbar" />

    <svg
      id="map"
      ref="map"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      @mousemove="onMouseMove"
      @click="store.onClick($event)"
      @mouseleave="onHover"
    >
      <defs>
        <template v-if="gardenStore.garden">
          <clipPath
            id="beds-clip"
            :transform="`translate(${backgroundImage.offset
              .map((c) => -c)
              .join(' ')})`"
          >
            <path
              v-for="bed in gardenStore.garden.beds"
              :key="bed.id"
              :d="pathGeneratorLocal(bed.shape)"
            />
          </clipPath>
        </template>
      </defs>
      <g ref="content" class="content">
        <template v-if="gardenStore.garden">
          <image
            v-if="backgroundImage.blobUrl"
            clip-path="url(#beds-clip)"
            :width="backgroundImage.width"
            :height="backgroundImage.height"
            :transform="`translate(${backgroundImage.offset.join(' ')})`"
            :href="backgroundImage.blobUrl"
          />

          <g v-for="(bed, i) in gardenStore.garden.beds" :key="bed.id">
            <path
              class="bed"
              :style="elementStyle('bed')"
              :d="pathGeneratorLocal(bed.shape)"
              @click.stop="store.onClick($event, { type: 'bed', item: bed })"
              @mouseenter="onHover($event, bed, i)"
              @mouseleave="onHover($event)"
            />
          </g>
        </template>

        <g v-if="gardenStore.grid">
          <path
            v-for="(area, i) in gardenStore.grid.areas"
            :key="i"
            class="area"
            :style="elementStyle('area')"
            :d="pathFromPointsLocal(area.polygon)"
            @click.stop="
              store.onClick($event, { type: 'area', item: area } as AreaElement)
            "
            @mouseenter="onHover($event, area, i)"
            @mouseleave="onHover($event)"
          />
        </g>

        <g
          v-for="planDisplay in gardenStore.displayPlans"
          :key="planDisplay.plan.id"
          :class="[
            'plan',
            { transparent: planDisplay.transparent },
            planDisplay.style,
          ]"
        >
          <PlantingComponent
            v-for="(planting, index) in planDisplay.plan.plantings"
            :key="`${index}-planting`"
            :planting="planting"
            :plants-interactive="planDisplay.editable && isInteractive('plant')"
            :style="elementStyle('planting')"
            @click.stop="
              store.onClick($event, { type: 'planting', item: planting })
            "
            @mouseover="onHover($event, planting, index)"
            @mouseleave="onHover($event)"
          />
        </g>

        <component
          v-if="store.tool?.cursorComponent"
          :is="store.tool.cursorComponent"
          v-bind="store.tool.cursorProps"
        />
      </g>
    </svg>

    <v-navigation-drawer
      :model-value="store.showDetails"
      width="300"
      location="right"
      absolute
      permanent
    >
      <DetailsPane />
    </v-navigation-drawer>

    <v-footer app border>
      <template v-if="store.tool">
        {{ store.tool.helpText }}
      </template>
      <v-spacer />
      {{
        store.cursorPosition.map((c) => Math.round(c * 100) / 100).join(", ")
      }}
    </v-footer>
  </v-layout>
</template>
<style scoped>
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

  &:deep(*) {
    vector-effect: non-scaling-stroke;
  }
}

.plan {
  &.transparent {
    opacity: 0.2;
  }
}

.bed {
  fill: rgba(255, 255, 255, 0.05);
  stroke: #000000;
  stroke-width: 1px;
}

.area {
  fill: rgba(255, 255, 255, 0.05);
  stroke: #999999;
  stroke-dasharray: 5;
  mix-blend-mode: multiply;
}
</style>

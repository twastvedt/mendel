<template>
  <svg
    id="map"
    ref="map"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    @mousemove="onMouseMove"
  >
    <g ref="content" class="content">
      <g v-if="pathGenerator && projection && state.garden" id="beds">
        <path
          v-for="bed in state.garden.beds"
          :key="`${bed.id}-bed`"
          :d="pathGenerator(bed.shape)"
        />

        <plant-component
          v-for="(plant, index) in state.garden.plants"
          :key="`${index}-plant`"
          :transform="`translate(${projection(plant.location.coordinates).join(
            ' '
          )})`"
          :plant="plant"
          @click="onClick($event, plant)"
        />
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Store from "../Store";
import * as d3 from "d3";
import { geoIdentity, geoPath } from "d3-geo";
import { zoom, D3ZoomEvent } from "d3-zoom";

import PlantComponent from "./PlantComponent.vue";
import { Plant } from "@/entity/Plant";

@Component({
  components: {
    PlantComponent,
  },
})
export default class GardenMap extends Vue {
  $refs!: {
    map: SVGSVGElement;
    content: SVGGElement;
  };

  state = Store.state;
  zoom!: d3.ZoomBehavior<SVGSVGElement, unknown>;
  pathGenerator = null as d3.GeoPath<unknown, d3.GeoPermissibleObjects> | null;
  projection?: d3.GeoIdentityTransform;

  zoomed(e: D3ZoomEvent<SVGSVGElement, unknown>): void {
    this.content.attr("transform", e.transform as any);

    this.state.scale = e.transform.k;
  }

  content!: d3.Selection<SVGGElement, unknown, null, undefined>;
  svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  async mounted(): Promise<void> {
    console.debug("Map mounted");

    await this.state.loadGarden();

    if (!this.state.garden) {
      return;
    }

    const offset = this.state.garden.beds[0].shape.coordinates[0][0] as [
      number,
      number
    ];

    // TODO: We assume data is stored in a meters-based projection. Converting to inches:
    this.projection = geoIdentity()
      .reflectY(true)
      .translate([-offset[0] / 0.0254, offset[1] / 0.0254])
      .scale(1 / 0.0254);

    this.pathGenerator = geoPath(this.projection);

    this.svg = d3.select(this.$refs.map);

    const width = this.$refs.map.clientWidth,
      height = this.$refs.map.clientHeight;

    d3.select(this.$refs.map).attr("viewBox", [0, 0, width, height] as any);

    this.content = d3
      .select(this.$refs.content)
      .attr("transform", "translate(0,0)");

    this.state.cursor = this.content.append("g").classed("cursor", true);

    this.zoom = zoom<SVGSVGElement, unknown>().on(
      "zoom",
      this.zoomed.bind(this)
    );

    this.svg.call(this.zoom);

    Vue.nextTick(() => this.zoomFit());

    // this.map
    //   .on("zoomend", this.onMapZoomed, this)
    //   .on("mouseout", this.onMouseOut, this)

    // L.tileLayer
    //   .wms("https://imageserver.gisdata.mn.gov/cgi-bin/mncomp?VERSION=1.3.0", {
    //     layers: "mncomp",
    //     maxZoom: 30,
    //   })
    //   .addTo(this.map);
  }

  zoomFit(): void {
    const bounds = this.$refs.content.getBBox();

    if (bounds) {
      const width = this.$refs.map.clientWidth,
        height = this.$refs.map.clientHeight,
        midX = bounds.x + bounds.width / 2,
        midY = bounds.y + bounds.height / 2;

      const scale =
          0.9 / Math.max(bounds.width / width, bounds.height / height),
        translate = [width / 2 - scale * midX, height / 2 - scale * midY];

      this.svg
        .transition()
        .duration(750)
        .call(
          this.zoom.transform,
          d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
        );
    }
  }

  onClick(event: MouseEvent, plant?: Plant): void {
    this.state.onClick(...d3.pointer(event, this.content.node()), plant);
  }

  onMouseMove(event: MouseEvent): void {
    if (this.state.tool && this.projection?.invert) {
      const point = this.projection.invert(
        d3.pointer(event, this.content.node())
      );

      if (point) {
        this.state.updateTool(...point);
      }
    }
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

::v-deep #beds path {
  fill: rgba($color: #ffffff, $alpha: 0.5);
  stroke: #000000;
  stroke-width: 1px;
}

.zoom1 {
  &::v-deep .plantMarkerIcon {
    display: none;
  }
}

.zoom3 {
  &::v-deep .plantMarkerIcon {
    width: 24px !important;
    height: 24px !important;
    margin-left: -12px !important;
    margin-top: -12px !important;
  }
}
</style>

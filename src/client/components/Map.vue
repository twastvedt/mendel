<template>
  <svg id="map" ref="map">
    <g ref="content" class="content">
      <g id="beds" ref="beds" />
    </g>
  </svg>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

import Store, { Action } from "../Store";

import * as d3 from "d3";

import { geoPath, geoTransform } from "d3-geo";

import { zoom, D3ZoomEvent } from "d3-zoom";

@Component({
  props: {
    msg: String,
  },
})
export default class Map extends Vue {
  $refs!: {
    map: SVGSVGElement;
    beds: SVGGElement;
    content: SVGGElement;
  };

  state = Store.state;
  zoom!: d3.ZoomBehavior<SVGSVGElement, unknown>;

  zoomed(e: D3ZoomEvent<SVGSVGElement, unknown>): void {
    this.content.attr("transform", e.transform as any);
  }

  content!: d3.Selection<SVGGElement, unknown, null, undefined>;
  svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  async mounted(): Promise<void> {
    console.debug("Map mounted");

    await this.state.loadGarden();

    if (!this.state.garden) {
      return;
    }

    const offset = this.state.beds[0].shape.coordinates[0][0];

    const transform = geoTransform({
      point: function (x, y) {
        this.stream.point(x - offset[0], offset[1] - y);
      },
    });

    const path = geoPath().projection(transform);

    d3.select(this.$refs.beds)
      .selectAll("path")
      .data(this.state.beds.map((b) => b.shape))
      .enter()
      .append("path")
      .attr("d", path);

    this.svg = d3.select(this.$refs.map);

    const width = this.$refs.map.clientWidth,
      height = this.$refs.map.clientHeight;

    d3.select(this.$refs.map).attr("viewBox", [0, 0, width, height] as any);

    this.content = d3
      .select(this.$refs.content)
      .attr("transform", "translate(0,0)");

    this.zoom = zoom<SVGSVGElement, unknown>().on(
      "zoom",
      this.zoomed.bind(this)
    );

    this.svg.call(this.zoom);

    this.zoomFit();

    // this.map
    //   .on("zoomend", this.onMapZoomed, this)
    //   .on("mouseout", this.onMouseOut, this)
    //   .on("mouseover", this.startDraw, this);

    // L.tileLayer
    //   .wms("https://imageserver.gisdata.mn.gov/cgi-bin/mncomp?VERSION=1.3.0", {
    //     layers: "mncomp",
    //     maxZoom: 30,
    //   })
    //   .addTo(this.map);
  }

  zoomFit(): void {
    const bounds = this.content.node()?.getBBox();

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

  startDraw(): void {
    // if (this.state.action !== Action.None && this.state.actionId) {
    //   const variety = this.state.varieties.find(
    //     (v) => v.id === this.state.actionId
    //   );
    //   if (variety) {
    //     this.map.pm.enableDraw("PlantMarker", {
    //       variety: variety,
    //       snappable: true,
    //       snapDistance: 20,
    //       cursorMarker: true,
    //       continueDrawing: true,
    //       tooltips: false,
    //     });
    //   }
    // }
  }

  onMouseOut(): void {
    // this.map.pm.Draw.PlantMarker.disable();
  }

  @Watch(nameof.full(Map.prototype.state.action, -2))
  @Watch(nameof.full(Map.prototype.state.actionId, -2))
  newAction(): void {
    switch (this.state.action) {
      case Action.DrawPlant:
        this.startDraw();

        break;

      case Action.None:
        // this.map.pm.Draw.PlantMarker.disable();

        break;

      default:
        break;
    }
  }

  // onMapZoomed(): void {
  //   const metersPerPixel = this.getMetersPerPixel();

  //   const classes = this.$el.classList;

  //   classes.remove("zoom1", "zoom2", "zoom3");

  //   if (metersPerPixel > 0.1) {
  //     classes.add("zoom1");
  //   } else if (metersPerPixel > 0.01) {
  //     classes.add("zoom2");
  //   } else {
  //     classes.add("zoom3");
  //   }
  // }
}
</script>

<style scoped lang="scss">
#map {
  width: 100%;
  height: 100%;
  display: block;
  z-index: 0;
}

::v-deep #beds path {
  fill: rgba($color: #ffffff, $alpha: 0.5);
  stroke: #000000;
  stroke-width: 0.01px;
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

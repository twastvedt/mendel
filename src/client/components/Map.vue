<template>
  <div id="map" ref="map"></div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import * as L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import proj4 from "proj4";

import { PlantMarker } from "../tools/PlantMarker";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(L as any).Proj = require("proj4leaflet");

import Store, { Action } from "../Store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

@Component({
  props: {
    msg: String,
  },
})
export default class Map extends Vue {
  $refs!: {
    map: HTMLDivElement;
  };

  state = Store.state;

  map!: L.Map;

  async mounted(): Promise<void> {
    console.debug("Map mounted");

    this.map = L.map(this.$refs.map, { minZoom: 0, maxZoom: 30 });

    this.map
      .on("zoomend", this.onMapZoomed, this)
      .on("mouseout", this.onMouseOut, this)
      .on("mouseover", this.startDraw, this);

    this.map.pm.Draw.PlantMarker = new PlantMarker(this.map);

    // Define projection used in database.
    proj4.defs(
      "EPSG:26915",
      "+proj=utm +zone=15 +ellps=GRS80 +datum=NAD83 +units=m +no_defs"
    );

    L.tileLayer
      .wms("https://imageserver.gisdata.mn.gov/cgi-bin/mncomp?VERSION=1.3.0", {
        layers: "mncomp",
        maxZoom: 30,
      })
      .addTo(this.map);

    await this.state.loadBeds();

    const beds = L.Proj.geoJson(
      this.state.beds.map((b) => b.shape),
      {
        style: {
          fillColor: "#ffffff",
          fillOpacity: 0.5,
          color: "#000000",
          weight: 2,
        },
      }
    ).addTo(this.map);

    this.map.fitBounds(beds.getBounds());
  }

  startDraw(): void {
    if (this.state.action !== Action.None && this.state.actionId) {
      const variety = this.state.varieties.find(
        (v) => v.id === this.state.actionId
      );

      if (variety) {
        this.map.pm.enableDraw("PlantMarker", {
          variety: variety,
          snappable: true,
          snapDistance: 20,
          cursorMarker: true,
          continueDrawing: true,
          tooltips: false,
        });
      }
    }
  }

  onMouseOut(event: L.LeafletMouseEvent): void {
    this.map.pm.Draw.PlantMarker.disable();
  }

  @Watch(nameof.full(Map.prototype.state.action, -2))
  @Watch(nameof.full(Map.prototype.state.actionId, -2))
  newAction(): void {
    switch (this.state.action) {
      case Action.DrawPlant:
        this.startDraw();

        break;

      case Action.None:
        this.map.pm.Draw.PlantMarker.disable();

        break;

      default:
        break;
    }
  }

  onMapZoomed(): void {
    const metersPerPixel = this.getMetersPerPixel();

    const classes = this.$el.classList;

    classes.remove("zoom1", "zoom2", "zoom3");

    if (metersPerPixel > 0.1) {
      classes.add("zoom1");
    } else if (metersPerPixel > 0.01) {
      classes.add("zoom2");
    } else {
      classes.add("zoom3");
    }
  }

  getMetersPerPixel(): number {
    const y = this.map.getSize().y;
    const x = this.map.getSize().x;

    // calculate the distance the one side of the map to the other using the haversine formula
    var maxMeters = this.map
      .containerPointToLatLng([0, y])
      .distanceTo(this.map.containerPointToLatLng([x, y]));
    // calculate how many meters each pixel represents
    return maxMeters / x;
  }
}
</script>

<style scoped lang="scss">
@import "~leaflet/dist/leaflet.css";
@import "~@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

#map {
  width: 100%;
  height: 100%;

  z-index: 0;
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

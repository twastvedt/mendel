<template>
  <div id="map"></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "proj4leaflet";

import proj4 from "proj4";

import { Bed } from "../../entity/Bed";
import { request } from "../ApiRequest";
import { Beds } from "../../api/Api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

@Options({
  props: {
    msg: String,
  },
})
export default class Map extends Vue {
  loading = false;
  error = "";
  beds!: Bed[];
  map!: L.Map;

  mounted(): void {
    console.debug("Map mounted");

    this.map = L.map("map", { minZoom: 0, maxZoom: 30 }).setView(
      [44.968726, -93.003271],
      20
    );

    proj4.defs(
      "EPSG:26915",
      "+proj=utm +zone=15 +ellps=GRS80 +datum=NAD83 +units=m +no_defs"
    );

    this.fetchData();

    this.map.pm.addControls({
      position: "topleft",
      drawCircle: false,
      drawRectangle: false,
      drawCircleMarker: false,
      cutPolygon: false,
      drawPolyline: false,
    });

    L.tileLayer
      .wms("https://imageserver.gisdata.mn.gov/cgi-bin/mncomp?VERSION=1.3.0", {
        layers: "mncomp",
        maxZoom: 30,
      })
      .addTo(this.map);
  }

  async fetchData(): Promise<void> {
    this.error = "";
    this.beds = [];
    this.loading = true;

    try {
      this.beds = await request(Beds.all, undefined, undefined);

      setTimeout(() => {
        L.Proj.geoJson(this.beds.map((b) => b.shape)).addTo(this.map);
      }, 2000);
    } catch (error) {
      this.error = error;
    }

    this.loading = false;
  }
}
</script>

<style scoped lang="scss">
@import "~leaflet/dist/leaflet.css";
@import "~@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

#map {
  width: 100%;
  height: 100%;
}
</style>

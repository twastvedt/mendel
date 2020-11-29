import * as L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import { Variety } from "@/entity/Variety";

declare module "leaflet" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PM {
    interface Map {
      enableDraw(
        shape: SUPPORTED_SHAPES | "PlantMarker",
        options?: MapDrawOptions
      ): void;

      disableDraw(
        shape: SUPPORTED_SHAPES | "PlantMarker",
        options?: MapDrawOptions
      ): void;
    }

    export interface GeomanHelpers {
      PlantMarker: PlantMarker;
    }

    export interface MapDrawOptions {
      variety?: Variety;
    }
  }
}

export class PlantMarker extends L.PM.Draw.Marker {
  _shape?: string;
  toolbarButtonName?: string;
  _enabled?: boolean;
  _hintMarker?: L.Marker;
  _layer?: L.Layer;

  spacingCircle?: L.Circle<null>;

  initialize(map: L.Map): void {
    super.initialize(map);

    this._shape = "PlantMarker";
    this.toolbarButtonName = "drawPlantMarker";
  }

  _syncHintMarker(e: L.LeafletMouseEvent): void {
    super._syncHintMarker(e);

    if (this.spacingCircle && this._hintMarker) {
      this.spacingCircle.setLatLng(this._hintMarker.getLatLng());
    }
  }

  enable(options: L.PM.MapDrawOptions): void {
    if (options.variety) {
      options.markerStyle = {
        icon: L.divIcon({
          className: "plantMarkerIcon",
          html: `<div style="fill: ${options.variety.color}">${options.variety.family.icon}</div>`,
        }),
      };

      this.spacingCircle = this.makeSpacingCircle([0, 0], options.variety);

      this.spacingCircle._pmTempLayer = true;

      this.spacingCircle.addTo(this._map);
    }

    super.enable(options);
  }

  disable(): void {
    super.disable();

    this.spacingCircle?.remove();
  }

  makeSpacingCircle(latlng: L.LatLngExpression, variety: Variety): L.Circle {
    return new L.Circle(latlng, variety.family.spacing * 0.0254, {
      fill: false,
      color: "#000000",
      dashArray: [4, 4],
      weight: 1,
      className: "plantMarkerCircle",
    });
  }

  _createMarker(e: L.LeafletMouseEvent): void {
    super._createMarker(e);

    if (this._hintMarker && this.spacingCircle && this.options.variety) {
      this.spacingCircle = this.makeSpacingCircle(
        this._hintMarker.getLatLng(),
        this.options.variety
      );

      this.spacingCircle.addTo(this._map.pm._getContainingLayer());
    }
  }
}

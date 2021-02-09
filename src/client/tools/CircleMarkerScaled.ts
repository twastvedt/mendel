import {
  LatLngBounds,
  Circle,
  Point,
  PointTuple,
  LatLngExpression,
  CircleMarkerOptions,
} from "leaflet";

declare module "leaflet" {
  interface Circle {
    _project(): void;
    _updateBounds(): void;
  }
}

/**
 * A Circle that always draws as a circle, or a CircleMarker that scales.
 */

export class CircleMarkerScaled<P = unknown> extends Circle<P> {
  private _point!: Point;
  private _radius!: number;
  private _radiusY!: number;

  // @method getBounds(): LatLngBounds
  // Returns the `LatLngBounds` of the path.
  getBounds(): LatLngBounds {
    const half: PointTuple = [this._radius, this._radius];

    return new LatLngBounds(
      this._map.layerPointToLatLng(this._point.subtract(half)),
      this._map.layerPointToLatLng(this._point.add(half))
    );
  }

  _project(): void {
    super._project();

    this._radiusY = this._radius;

    this._updateBounds();
  }
}

// @factory L.circleMarkerScaled(latlng: LatLng, options?: Circle options)
// Instantiates a circle object given a geographical point, and an options object
// which contains the circle radius.
export function circleMarkerScaled(
  latlng: LatLngExpression,
  options?: CircleMarkerOptions
): CircleMarkerScaled {
  return new CircleMarkerScaled(latlng, options);
}

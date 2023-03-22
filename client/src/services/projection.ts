import { geoIdentity, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";
import type { Position } from "@mendel/common";

// TODO: We assume data is stored in inches relative to garden origin.
export const projection = geoIdentity().reflectY(true);

const projectionGenerator = geoPath(projection);

export function pathGenerator(o: GeoPermissibleObjects) {
  return projectionGenerator(o) ?? undefined;
}

export function makeTransform(coordinate: Position): string {
  return `translate(${projection(coordinate)?.join(" ")})`;
}

export function pathFromPoints(coordinates: Position[]): string | undefined {
  return pathGenerator({ type: "LineString", coordinates });
}

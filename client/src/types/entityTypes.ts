import { EntityBase, Plant, Planting } from "@mendel/common";

export function isPlant(entity?: EntityBase): entity is Plant {
  return !!(entity as Plant).location;
}

export function isPlanting(entity?: EntityBase): entity is Planting {
  return !!(entity as Planting).shape;
}

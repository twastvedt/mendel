import { EntityBase, Planting } from "@mendel/common";

export function isPlanting(entity?: EntityBase): entity is Planting {
  return !!(entity as Planting).shape;
}

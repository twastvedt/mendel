import { EntityBase } from "@/entity/EntityBase";
import { Plant } from "@/entity/Plant";
import { Planting } from "@/entity/Planting";

export function isPlant(entity?: EntityBase): entity is Plant {
  return !!(entity as Plant).location;
}

export function isPlanting(entity?: EntityBase): entity is Planting {
  return !!(entity as Planting).shape;
}

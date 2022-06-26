import { Bed, EntityBase, Planting, Position } from "@mendel/common";

export function isPlanting(entity?: EntityBase): entity is Planting {
  return !!(entity as Planting).shape;
}

export type UiElementType = "bed" | "planting" | "plant" | "area";

export interface UiElementBase {
  type: UiElementType;
  item: EntityBase;
}

export interface BedElement extends UiElementBase {
  type: "bed";
  item: Bed;
}

export interface PlantingElement extends UiElementBase {
  type: "planting";
  item: Planting;
}

export interface PlantElement extends UiElementBase {
  type: "plant";
  item: Planting;
  position: Position;
}

export interface AreaElement extends UiElementBase {
  type: "area";
  item: EntityBase;
}

export type UiElement =
  | BedElement
  | PlantElement
  | PlantingElement
  | AreaElement;

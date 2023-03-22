import type { Bed, EntityBase, Planting } from "@mendel/common";
import type { Plant } from "@mendel/common/src/entity/Plant";

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
  item: Plant;
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

export function getEntityIcon(entity: UiElement): string {
  switch (entity.type) {
    case "area":
      return "mdi-triangle-outline";

    case "bed":
      return "mdi-rectangle-outline";

    case "plant":
      return "mdi-sprout";

    case "planting":
      return "mdi-dots-hexagon";
  }
}

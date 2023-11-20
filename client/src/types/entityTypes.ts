import type {
  BedLocal,
  EntityBase,
  Planting,
  PlantingLocal,
  EntityLocalBase,
  PlantLocal,
} from "@mendel/common";

export function isPlanting(entity?: EntityBase): entity is Planting {
  return !!(entity as Planting).shape;
}

export type UiElementType = "bed" | "planting" | "plant" | "area";

export interface UiElementBase {
  type: UiElementType;
  item: EntityLocalBase;
}

export interface BedElement extends UiElementBase {
  type: "bed";
  item: BedLocal;
}

export interface PlantingElement extends UiElementBase {
  type: "planting";
  item: PlantingLocal;
}

export interface PlantElement extends UiElementBase {
  type: "plant";
  item: PlantLocal;
}

export interface AreaElement extends UiElementBase {
  type: "area";
  item: EntityLocalBase;
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

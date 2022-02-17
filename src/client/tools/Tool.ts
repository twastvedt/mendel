import { EntityBase } from "@/entity/EntityBase";
import { Position } from "@/entity/geoJson";
import { VueConstructor } from "vue";
import { Action } from "../actions/Action";
import { ElementType } from "../Store";

export interface Tool {
  OnClick(point: Position, element?: EntityBase): Action | void;

  OnHover?(point: Position, element?: EntityBase, index?: number): void;

  Start(): void;
  Stop(): void;

  OnCursorMove(point: Position): void;

  interactiveElements?: Set<ElementType>;

  cursorComponent?: VueConstructor;
  cursorProps?: Record<string, unknown>;
}

import type { Position } from "@mendel/common";
import type { VueConstructor } from "vue";
import type { Action } from "../actions/Action";
import type { UiElement, UiElementType } from "../types/entityTypes";

export interface Tool {
  helpText: string;

  interactiveElements?: Set<UiElementType>;

  cursorComponent?: VueConstructor;
  cursorProps?: Record<string, unknown>;

  start?(): void;
  stop?(): void;

  onCursorMove?(point: Position): void;
  onHover?(point: Position, index?: number, element?: unknown): void;
  onClick(point: Position, element?: UiElement): Action | void;
}

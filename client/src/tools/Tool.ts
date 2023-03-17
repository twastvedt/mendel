import { Position } from "@mendel/common";
import { VueConstructor } from "vue";
import { Action } from "../actions/Action";
import { UiElement, UiElementType } from "../types/entityTypes";

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

import type { Position } from "@mendel/common";
import type { Component } from "vue";
import type { Action } from "../actions/Action";
import type { UiElement, UiElementType } from "../types/entityTypes";

export interface Tool {
  helpText: string;

  interactiveElements?: Set<UiElementType>;

  cursorComponent?: Component;
  cursorProps?: Record<string, unknown>;

  start?(): void;
  stop?(): void;

  onCursorMove?(point: Position): void;
  onHover?(point: Position, index?: number, element?: unknown): void;
  onClick(point: Position, element?: UiElement): Action | void;
}

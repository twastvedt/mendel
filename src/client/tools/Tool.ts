import { Position } from "@/entity/geoJson";
import { VueConstructor } from "vue";
import { Action } from "../actions/Action";
import { ElementType } from "../Store";

export interface Tool {
  helpText: string;

  interactiveElements?: Set<ElementType>;

  cursorComponent?: VueConstructor;
  cursorProps?: Record<string, unknown>;

  start?(): void;
  stop?(): void;

  onCursorMove?(point: Position): void;
  onHover?(point: Position, index?: number, element?: unknown): void;
  onClick(point: Position, element?: unknown): Action | void;
}

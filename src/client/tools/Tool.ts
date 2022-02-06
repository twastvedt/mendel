import { EntityBase } from "@/entity/EntityBase";
import { VueConstructor } from "vue";
import { Action } from "../actions/Action";
import { ElementType } from "../Store";

export interface Tool {
  OnClick(x: number, y: number, element?: EntityBase): Action | void;

  OnHover?(x: number, y: number, element?: EntityBase, index?: number): void;

  Start(): void;
  Stop(): void;

  OnCursorMove(x: number, y: number): void;

  interactiveElements?: Set<ElementType>;

  cursorComponent?: VueConstructor;
  cursorProps?: Record<string, unknown>;
}

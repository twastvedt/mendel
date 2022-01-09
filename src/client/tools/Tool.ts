import { Plant } from "@/entity/Plant";
import { VueConstructor } from "vue";
import { Action } from "../actions/Action";

export interface Tool {
  OnClick(x: number, y: number, plant?: Plant): Action | void;

  Start(): void;
  Stop(): void;

  OnCursorMove(x: number, y: number): void;

  cursorComponent?: VueConstructor;
  cursorProps?: Record<string, unknown>;
}

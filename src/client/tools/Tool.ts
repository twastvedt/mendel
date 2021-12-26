import { Garden } from "@/entity/Garden";
import { Action } from "../actions/Action";

export abstract class Tool {
  public constructor(protected garden: Garden) {}

  public abstract OnClick(x: number, y: number): Action;

  public abstract Start(): void;
  public abstract Stop(): void;

  public abstract OnCursorMove(x: number, y: number): void;
}

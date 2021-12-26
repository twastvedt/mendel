import { Plant } from "@/entity/Plant";
import { Action } from "../actions/Action";
import Store from "../Store";

export abstract class Tool {
  public constructor(protected state: Store) {}

  public abstract OnClick(x: number, y: number, plant?: Plant): Action | void;

  public abstract Start(): void;
  public abstract Stop(): void;

  public abstract OnCursorMove(x: number, y: number): void;
}

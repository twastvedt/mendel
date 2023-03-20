import type { State } from "../state/State";

export enum ActionState {
  None,
  Done,
  Undone,
}

export abstract class Action {
  public state = ActionState.None;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async Do(state: State): Promise<void> {
    this.state = ActionState.Done;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async Undo(state: State): Promise<void> {
    this.state = ActionState.Undone;
  }
}

import Store from "../Store";

export enum ActionState {
  None,
  Done,
  Undone,
}

export abstract class Action {
  public state = ActionState.None;

  public async Do(state: Store): Promise<void> {
    this.state = ActionState.Done;
  }
  public async Undo(state: Store): Promise<void> {
    this.state = ActionState.Undone;
  }
}

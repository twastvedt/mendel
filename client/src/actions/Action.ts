export enum ActionState {
  None,
  Done,
  Undone,
}

export abstract class Action {
  public state = ActionState.None;

  public async Do(): Promise<void> {
    this.state = ActionState.Done;
  }

  public async Undo(): Promise<void> {
    this.state = ActionState.Undone;
  }
}

import * as PIXI from "pixi.js";

export enum SceneEventTypes {
  REPOSITION = "reposition"
}

export class BaseContainer extends PIXI.Container {

  public readonly stage: BaseContainer | undefined;

  constructor(stage?: BaseContainer | undefined) {
    super();

    this.stage = stage;
  }
}

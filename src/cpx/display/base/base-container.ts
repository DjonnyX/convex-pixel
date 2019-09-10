import * as PIXI from "pixi.js";
import { App } from "../../core/app";

export enum SceneEventTypes {
  REPOSITION = "reposition",
}

export class BaseContainer<T extends App = any, S extends BaseContainer = any> extends PIXI.Container {
  constructor(public readonly appContext: T, public readonly cpxStage?: S) {
    super();
  }
}

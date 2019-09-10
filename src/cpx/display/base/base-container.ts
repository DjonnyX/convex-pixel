import * as PIXI from "pixi.js";
import { App } from "@cpx/cpx/core/app";

export enum SceneEventTypes {
  REPOSITION = "reposition",
}

export class BaseContainer<T extends App = any, S extends BaseContainer = any> extends PIXI.Container {
  constructor(public readonly context: T, public readonly stage?: S) {
    super();
  }
}

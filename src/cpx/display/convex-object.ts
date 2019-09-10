import * as PIXI from "pixi.js";
import { BaseContainer, BaseRoom, BaseConvexObject, IBaseConvexObjectConfig } from "./base";
import { App } from "../core/package";

export interface IConvexObjectConfig extends IBaseConvexObjectConfig {
  x?: number;
  y?: number;
  depth: number;
  scale: number;
  /**
   * Polygon for reconstruction a hit-area
   */
  hitArea?: number[];
  interactive?: boolean;
  isBackground?: boolean;
}

export class ConvexObject<T extends App = any, C extends IConvexObjectConfig = any> extends BaseConvexObject<T, C> {
  constructor(public readonly context: T, stage: BaseContainer, config: C) {
    super(context, stage, config);
  }

  public setPOV(x: number, y: number) {
    if (!this._displacementFilter) {
      return;
    }

    const depth = this._config.isBackground ? 1 : this._config.depth;
    this._displacementFilter.scale.x = x * depth * this.context.room.camera.maxZoom;
    this._displacementFilter.scale.y = y * depth * this.context.room.camera.maxZoom;
  }

  /**
   * Recalculation POV
   * Repeat сalls are blocked
   */
  public recalculateCameraPOV() {
    (this.context.room as BaseRoom).recalculateCameraPOV();
  }

  public pointerHover() {}

  public pointerOutside() {}

  public dispose() {
    super.destroy();
  }

  protected loadingComplete() {
    if (!this._container) {
      throw Error(`Propery "_container" is not defined.`);
    }

    if (this._config.interactive) {
      this._container.interactive = Boolean(this._config.interactive);

      if (this._config.hitArea) {
        this._container.hitArea = new PIXI.Polygon(this._config.hitArea);
      }

      this._container.on("pointerover", this._pointerOverHandler);
      this._container.on("pointerout", this._pointerOutHandler);
    }
    // set pivot and scale
    this._container.scale.x = this._container.scale.y = this._config.scale;
    this.pivot.set(this.width * 0.5, this.height * 0.5);

    super.loadingComplete();
  }

  public get container() {
    return this._container;
  }

  private _pointerOverHandler = () => {
    this.pointerHover();
  };

  private _pointerOutHandler = () => {
    this.pointerOutside();
  };
}

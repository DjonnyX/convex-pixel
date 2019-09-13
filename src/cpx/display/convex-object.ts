import * as PIXI from "pixi.js";
import { BaseContainer, BaseRoom, BaseConvexObject, IBaseConvexObjectConfig } from "./base";
import { App } from "../core/app";

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
  constructor(public readonly appContext: T, config: C) {
    super(appContext, config);
  }

  public setPOV(x: number, y: number) {
    if (!this._displacementFilter) {
      return;
    }

    const depth = this._config.isBackground ? 1 : this._config.depth;
    this._displacementFilter.scale.x = x * depth * this.appContext.room.camera.maxZoom;
    this._displacementFilter.scale.y = y * depth * this.appContext.room.camera.maxZoom;
  }

  /**
   * Recalculation POV
   * Repeat сalls are blocked
   */
  public recalculateCameraPOV() {
    (this.appContext.room as BaseRoom).recalculateCameraPOV();
  }

  public dispose() {
    if (this._container) {
      this._container.removeAllListeners();
    }
    super.destroy();
  }

  protected pointerHover() {}

  protected pointerOutside() {}

  protected pointerTap() {}

  public get originalWidth() {
    const scale = this._container ? this._container.scale.x : 1;
    return this._originalWidth * scale;
  }

  public get originalHeight() {
    const scale = this._container ? this._container.scale.y : 1;
    return this._originalHeight * scale;
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

      this._container.addListener("pointerover", this._pointerOverHandler);
      this._container.addListener("pointerout", this._pointerOutHandler);
      this._container.addListener("pointertap", this._pointerTapHandler);
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

  private _pointerTapHandler = () => {
    this.pointerTap();
  };
}

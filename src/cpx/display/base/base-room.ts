import * as PIXI from "pixi.js";
import { Camera, ICameraConfig, ICameraController } from "@cpx/camera";
import { P3DCameraProcessor } from "@cpx/core";
import { DisplayUtils, SonarUtils } from "@cpx/utils";
import { BaseContainer } from "./base-container";

export interface IRoomOptions {
  camera: {
    class: new (
      room: BaseRoom,
      viewport?: PIXI.Rectangle,
      config?: ICameraConfig
    ) => Camera;
    config: ICameraConfig;
    controllers: Array<new () => ICameraController>;
    viewport?: PIXI.Rectangle;
  };
  autosize: DisplayUtils.RatioFitTypes;
}

export class BaseRoom extends BaseContainer {

  public get camera() {
    return this._camera;
  }

  public get roomBound() {
    return this._roomBound;
  }

  protected _roomBound = new PIXI.Rectangle();

  protected _cameraProcessor: P3DCameraProcessor;

  protected _camera: Camera;

  protected _autosize: DisplayUtils.RatioFitTypes;

  private _sonarResize: SonarUtils.SonarDebounce;

  constructor(options: IRoomOptions) {
    super();

    this._autosize = options.autosize || DisplayUtils.RatioFitTypes.NONE;

    // Create a camera
    this._camera = new options.camera.class(
      this,
      options.camera.viewport,
      options.camera.config
    );

    for (const controller of options.camera.controllers) {
      if (!this._camera.controllers) {
        continue;
      }

      this._camera.controllers.add(new controller());
    }

    this._cameraProcessor = new P3DCameraProcessor(this);

    this._sonarResize = new SonarUtils.SonarDebounce();
    this._sonarResize.addListener(SonarUtils.SonarEventTypes.CHANGE, this._resizeSonarHandler);
    // this._dispatcher.addEventListener("resize", this._resizeHandler);
    // this._dispatcher.addEventListener("recalculate-pov", this._recalculatePOVHandler);
  }

  public recalculateCameraPOV() {
    this._cameraProcessor.updatePOV(this);
  }

  public setViewport(width: number, height: number) {
    this._camera.viewport.width = width;
    this._camera.viewport.height = height;

    this.resetScaleFactor();
  }

  public setSize(width: number, height: number) {
    this._roomBound.width = width;
    this._roomBound.height = height;

    this.resetScaleFactor();
  }

  public destroy() {
    this._sonarResize.destroy();

    this._cameraProcessor.destroy();

    this._camera.destroy();

    super.destroy();
  }

  protected resetScaleFactor() {
    this._camera.maxZoom = DisplayUtils.getRatio(
      this._roomBound.width,
      this._roomBound.height,
      this._camera.viewport.width,
      this._camera.viewport.height,
      this._autosize
    );
  }

  private _resizeSonarHandler = () => {
    this.resetScaleFactor();
  }
}

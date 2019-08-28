import { TweenMax, Expo, Sine } from "gsap";
import * as PIXI from "pixi.js";
import { SonarUtils } from "../utils";
import { CameraControllerManager, CameraControllerEventTypes } from "./controller";
import { Vector2D } from "../utils/geom";
import { BaseRoom } from "../display";

const DEFAULT_BOUNDS = new PIXI.Rectangle(0, 0, 640, 480);

export interface ICameraConfig {
  pov: number;
  dof: number;
  float: boolean;
  maxXOffset: number;
  maxYOffset: number;
  xOffset: number;
  yOffset: number;
}

export class Camera extends PIXI.utils.EventEmitter {

  public get room() {
    return this._room;
  }

  public set maxZoom(v: number) {
    this._maxZoom = v;
    this.emit(CameraControllerEventTypes.ZOOM, { maxZoom: this._maxZoom });

    // reposition the camera target
    TweenMax.killTweensOf(this._cameraPosition);
    this.normalizeCameraMove(this._cameraPosition);
    this._handlePivotUpdate();

    // reset pov factor
    TweenMax.killTweensOf(this._pov);
    this.normalizeCameraPOV(this._pov);
    this._handlePOVUpdate();
  }

  public get maxZoom() {
    return this._maxZoom;
  }

  /**
   * If you change the properties of the Bound then the Sonar will
   * begin to check it for changes.
   */
  public get viewport() {
    return this._viewport;
  }

  public get float() {
    return this._float;
  }

  /**
   * Returns PointOfView
   */
  public get pov() {
    return this._pov;
  }

  public get dof() {
    return this._dof;
  }

  public get controllers() {
    return this._controllers;
  }

  public get x() {
    return this._x;
  }

  public get y() {
    return this._y;
  }

  public get povFactor() {
    return this._povFactor;
  }

  public get maxXOffset() {
    return this._maxXOffset;
  }

  public get maxYOffset() {
    return this._maxYOffset;
  }

  public get xOffset() {
    return this._xOffset;
  }

  public get yOffset() {
    return this._yOffset;
  }

  protected _dof: number;

  protected _povFactor: number;

  protected _maxXOffset: number;

  protected _maxYOffset: number;

  protected _xOffset: number;

  protected _yOffset: number;

  protected _float: boolean;

  protected _controllers: CameraControllerManager | undefined;

  protected _sonarViewport: SonarUtils.SonarDetector;

  protected _x = 0;

  protected _y = 0;

  protected _tweenPivot: TweenMax | undefined;

  protected _tweenPOV: TweenMax | undefined;

  protected _cameraPosition = Vector2D.new();

  protected _pov = Vector2D.new();

  protected _maxZoom = 1;

  constructor(
    protected _room: BaseRoom,
    protected _viewport: PIXI.Rectangle = DEFAULT_BOUNDS,
    config: ICameraConfig
  ) {
    super();

    this._povFactor = config.pov || 1;
    this._dof = (1 / (config.dof || 35)) * 30;
    this._maxXOffset = config.maxXOffset || 100;
    this._maxYOffset = config.maxYOffset || 100;
    this._xOffset = config.xOffset || 10;
    this._yOffset = config.yOffset || 10;
    this._float = config.float || false;

    this.createControllerManager();

    this._sonarViewport = new SonarUtils.SonarDetector(
      this._viewport,
      ["x", "y", "width", "height"],
      "change"
    );
    this._sonarViewport.addListener("change", () => {
      // this.emit("change-bound", { ...this._bounds });
    });
  }

  public destroy() {
    if (this._tweenPivot) {
      this._tweenPivot.kill();
      this._tweenPivot = undefined;
    }
    this.removeControllerManager();
    this._sonarViewport.destroy();

    this._cameraPosition.free();
    this._pov.free();
  }

  /**
   * Normalize and modify the target
   */
  protected normalizeCameraMove(target: Vector2D) {
    const sceneBounds = this._room.roomBound;
    const sWidth = sceneBounds.width * this._room.scale.x;
    const sHeight = sceneBounds.height * this._room.scale.y;
    const maxX = sWidth - this._viewport.width;
    const maxY = sHeight - this._viewport.height;

    if (maxX <= 0) {
      target.x = maxX * 0.5;
    } else {
      if (target.x > maxX) target.x = maxX;
      else if (target.x < 0) target.x = 0;
    }

    if (maxY <= 0) {
      target.y = maxY * 0.5;
    } else {
      if (target.y > maxY) target.y = maxY;
      else if (target.y < 0) target.y = 0;
    }

    return true;
  }

  protected normalizeCameraPOV(target: Vector2D) {
    /*if (this._maxXOffset && Math.abs(target.x) > this._maxXOffset) {
      target.x = this._maxXOffset * Math.sign(target.x);
    }
    if (this._maxYOffset && Math.abs(target.y) > this._maxYOffset) {
      target.y = this._maxYOffset * Math.sign(target.y);
    }*/
  }

  protected _handlerCameraMove = (target: Vector2D) => {
    const needAnimation = this.normalizeCameraMove(target);

    if (!needAnimation) {
      this._handlePivotUpdate();
      return;
    }

    if (this._tweenPivot) {
      this._tweenPivot.updateTo({ x: target.x, y: target.y }, true);
    } else {
      this._tweenPivot = TweenMax.to(this._cameraPosition, 2, {
        x: target.x,
        y: target.y,
        onUpdate: this._handlePivotUpdate,
        ease: Sine.easeOut
      });
    }

    target.free();
  };

  protected _handlerCameraPOV = (target: Vector2D) => {
    this.normalizeCameraPOV(target);

    if (this._tweenPOV) {
      this._tweenPOV.updateTo({ x: target.x, y: target.y }, true);
    } else {
      this._tweenPOV = TweenMax.to(this._pov, 0.5, {
        x: target.x,
        y: target.y,
        onUpdate: this._handlePOVUpdate,
        ease: Expo.easeOut
      });
    }

    target.free();
  };

  protected _handlePivotUpdate = () => {
    this._x = this._cameraPosition.x;
    this._y = this._cameraPosition.y;

    this.emit(CameraControllerEventTypes.MOVE, this._cameraPosition);
  };

  protected _handlePOVUpdate = () => {
    this.emit(CameraControllerEventTypes.POV, this._pov);
  };

  protected _handlerCameraZoom = (zoom: number) => {
    this.emit(CameraControllerEventTypes.ZOOM, zoom);
  };

  protected _handlerCameraRotate = (rotation: number) => {
    this.emit(CameraControllerEventTypes.ROTATE, rotation);
  };

  private createControllerManager() {
    this._controllers = new CameraControllerManager(this);
    this._controllers.addListener(
      CameraControllerEventTypes.MOVE,
      this._handlerCameraMove
    );
    this._controllers.addListener(
      CameraControllerEventTypes.POV,
      this._handlerCameraPOV
    );
    this._controllers.addListener(
      CameraControllerEventTypes.ZOOM,
      this._handlerCameraZoom
    );
    this._controllers.addListener(
      CameraControllerEventTypes.ROTATE,
      this._handlerCameraRotate
    );
  }

  private removeControllerManager() {
    if (this._controllers) {
      this._controllers.removeListener(
        CameraControllerEventTypes.MOVE,
        this._handlerCameraMove
      );
      this._controllers.removeListener(
        CameraControllerEventTypes.POV,
        this._handlerCameraPOV
      );
      this._controllers.removeListener(
        CameraControllerEventTypes.ZOOM,
        this._handlerCameraZoom
      );
      this._controllers.removeListener(
        CameraControllerEventTypes.ROTATE,
        this._handlerCameraRotate
      );
      this._controllers.destroy();
    }
  }
}

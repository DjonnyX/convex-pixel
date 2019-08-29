import { App } from "../../core/package";
import { ICameraController } from "./interfaces";
import { Vector2D, IVector2D } from "../../utils/geom/vector";
import { Camera } from "../camera";

export class CameraGyroscopeController implements ICameraController {
  public camera: Camera | undefined;

  public onMove: ((target: IVector2D) => void) | undefined;
  public onPOV: ((target: IVector2D) => void) | undefined;
  public onZoom: ((zoom: number) => void) | undefined;
  public onRotate: ((rotation: number) => void) | undefined;

  private _initialX: number | undefined;
  private _initialY: number | undefined;
  private _initialZ: number | undefined;

  constructor() {
    App.instance.pixi.stage.interactive = true;
    window.addEventListener(
      "MozOrientation",
      this._handlerOrientationEvent,
      true
    );
    window.addEventListener(
      "deviceorientation",
      this._handlerOrientationEvent,
      true
    );
  }

  public destroy() {
    window.removeEventListener("mousemove", this._handlerOrientationEvent);
    this.onMove = this.onPOV = this.onZoom = this.onRotate = undefined;
  }

  protected _handlerOrientationEvent = (event: any) => {

    if (!this.camera) {
      throw Error("Property \"camera\" is not defined.")
    }

    const sceneBounds = this.camera.room.roomBound;
    const sWidth = sceneBounds.width * this.camera.room.scale.x;
    const sHeight = sceneBounds.height * this.camera.room.scale.y;

    const x = event.gamma
      ? event.gamma
      : (event.x / 90) * this.camera.viewport.width;
    const y = event.beta
      ? event.beta
      : (event.y / 90) * this.camera.viewport.width;
    const z = event.alpha
      ? event.alpha
      : (event.z / 90) * this.camera.viewport.height;


    if (this._initialX === undefined || this._initialY === undefined || this._initialZ === undefined) {
      this._initialX = x;
      this._initialY = y;
      this._initialZ = z;
    } else {
      const xx = this._initialX - x;
      const yy = this._initialY - y;
      /*
      let sx = xx * this.camera.xOffset * 20;
      let sy = yy * this.camera.yOffset * 20;

      let povX = sx * 0.0075 * this.camera.povFactor;
      let povY = sy * 0.0075 * this.camera.povFactor;
      if (this.camera.maxXOffset && Math.abs(povX) > this.camera.maxXOffset) {
        povX = this.camera.maxXOffset * Math.sign(povX);
      }
      if (this.camera.maxYOffset && Math.abs(povY) > this.camera.maxYOffset) {
        povY = this.camera.maxYOffset * Math.sign(povY);
      }*/
      if (this.onPOV) {
        this.onPOV(Vector2D.new(xx, yy));
      }

      const sx =
        (sWidth - this.camera.viewport.width) /
        (this.camera.viewport.width / xx);
      const sy =
        (sHeight - this.camera.viewport.height) /
        (this.camera.viewport.height / yy);

      if (this.onMove) {
        this.onMove(Vector2D.new(sx, sy));
      }
    }
  };
}

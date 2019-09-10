import { App } from "../../core/package";
import { ICameraController } from "./interfaces";
import { IVector2D, Vector2D } from "../../utils/geom";
import { Camera } from "../camera";

export class CameraMouseController<T extends App = any> implements ICameraController {
  public camera: Camera | undefined;

  public onMove: ((data: IVector2D) => void) | undefined;
  public onPOV: ((data: IVector2D) => void) | undefined;
  public onZoom: ((zoom: number) => void) | undefined;
  public onRotate: ((rotation: number) => void) | undefined;

  protected _cameraTarget = new Vector2D();

  constructor(public readonly context: T) {
    context.pixi.stage.interactive = true;
    context.pixi.stage.on("mousemove", this._handlerStageMouseMove);
    context.pixi.stage.on("touchmove", this._handlerStageTouchMove);
  }

  public initialize() {
    if (!this.camera) {
      throw Error(`Property "camera" is not defined`);
    }

    this._handlerStageMouseMove({
      data: {
        global: {
          x: this.camera.viewport.width * 0.5,
          y: this.camera.viewport.height * 0.5,
        },
      },
    });
  }

  public destroy() {
    this.context.pixi.stage.off("mousemove", this._handlerStageMouseMove);
    this.context.pixi.stage.off("touchmove", this._handlerStageTouchMove);
    this.onMove = this.onPOV = this.onZoom = this.onRotate = undefined;
  }

  protected _handlerStageTouchMove = (event: any) => {
    this.calculate(event.data.global.x, event.data.global.y);
  };

  protected _handlerStageMouseMove = (event: any) => {
    this.calculate(event.data.global.x, event.data.global.y);
  };

  private calculate(x: number, y: number) {
    if (!this.camera) {
      throw Error(`Property "camera" is not defined`);
    }

    const sceneBounds = this.camera.room.roomBound;
    const sWidth = sceneBounds.width * this.camera.room.scale.x;
    const sHeight = sceneBounds.height * this.camera.room.scale.y;

    const xx = this.camera.viewport.width * 0.5 - x;
    const yy = this.camera.viewport.height * 0.5 - y;
    /*if (x > this.camera.viewport.width) xx = this.camera.viewport.width;
    else if (x < 0) xx = 0;
    if (y > this.camera.viewport.height) yy = this.camera.viewport.height;
    else if (y < 0) yy = 0;*/

    // const sign = inverse ? -1 : 1;

    // let sx =
    //     this.camera.viewport.width * 0.5 -
    //     xx /* *
    //  this.camera.maxXOffset * sign*/;
    // let sy =
    //      this.camera.viewport.height * 0.5 -
    //     yy /* *
    //   this.camera.maxYOffset * sign*/;

    /*let povX = -sx * 0.0075 * this.camera.povFactor;
    let povY = sy * 0.0075 * this.camera.povFactor;
    if (Math.abs(povX) > this.camera.maxXOffset) {
      povX = this.camera.maxXOffset * Math.sign(povX);
    }
    if (Math.abs(povY) > this.camera.maxYOffset) {
      povY = this.camera.maxYOffset * Math.sign(povY);
    }*/

    if (this.onPOV) {
      this.onPOV(Vector2D.new(xx, yy));
    }

    const sx = (sWidth - this.camera.viewport.width) * (x / this.camera.viewport.width);
    const sy = (sHeight - this.camera.viewport.height) * (y / this.camera.viewport.height);

    if (this.onMove) {
      this.onMove(Vector2D.new(sx, sy));
    }
  }
}

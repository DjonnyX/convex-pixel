import { App } from "../../core/app";
import { ICameraController } from "./interfaces";
import { IVector2D, Vector2D } from "../../utils/geom";
import { FaceTrackerService } from "../service";
import { Camera } from "../camera";

export class CameraFaceTrackerController<T extends App = any> implements ICameraController {
  public camera: Camera | undefined;

  public onMove: ((data: IVector2D) => void) | undefined;
  public onPOV: ((data: IVector2D) => void) | undefined;
  public onZoom: ((zoom: number) => void) | undefined;
  public onRotate: ((rotation: number) => void) | undefined;

  protected _cameraTarget = new Vector2D();

  protected _faceTrackerService: FaceTrackerService;

  constructor(public readonly appContext: T) {
    appContext.pixi.stage.interactive = true;
    this._faceTrackerService = new FaceTrackerService();
    this._faceTrackerService.addListener("move", this._handlerFaceMove);
  }

  public initialize() {
    /*this._handlerFaceMove({
      data: {
          x: this.camera.viewport.width * 0.5,
          y: this.camera.viewport.height * 0.5
      }
    });*/
  }

  public destroy() {
    this.onMove = this.onPOV = this.onZoom = this.onRotate = undefined;
  }

  protected _handlerFaceMove = (pos: IVector2D) => {
    this.calculate(pos.x, -pos.y);
  };

  private calculate(x: number, y: number) {
    if (!this.camera) {
      return;
    }

    const sceneBounds = this.camera.room.roomBound;
    const sWidth = sceneBounds.width * this.camera.room.scale.x;
    const sHeight = sceneBounds.height * this.camera.room.scale.y;

    const halfWidth = this.camera.viewport.width * 0.5;
    const halfHeight = this.camera.viewport.height * 0.5;

    const normalizedX = halfWidth + halfWidth * x;
    const normalizedY = halfHeight + halfHeight * y;

    const xx = halfWidth * x;
    const yy = halfHeight * y;
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

    const sx = (sWidth - this.camera.viewport.width) * (normalizedX / this.camera.viewport.width);
    const sy = (sHeight - this.camera.viewport.height) * (normalizedY / this.camera.viewport.height);

    if (this.onMove) {
      this.onMove(Vector2D.new(sx, sy));
    }
  }
}

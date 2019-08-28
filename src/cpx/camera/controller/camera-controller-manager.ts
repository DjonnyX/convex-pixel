import * as PIXI from "pixi.js";
import { IVector2D } from "../../utils/geom/vector";
import { Camera } from "../camera";
import { CameraControllerEventTypes } from "./events/event-types";
import { ICameraController } from "./interfaces";

export class CameraControllerManager extends PIXI.utils.EventEmitter {

  protected _controllers: ICameraController[] = [];

  constructor(protected _camera: Camera) {
    super();
  }
  public add(controller: ICameraController) {
    this._controllers.push(controller);
    controller.camera = this._camera;
    controller.onMove = this._handlerControllerMove;
    controller.onPOV = this._handlerControllerPOV;
    controller.onZoom = this._handlerControllerZoom;
    controller.onRotate = this._handlerControllerRotate;
  }

  public removeAll() {
    while (this._controllers.length > 0) {
      const controller = this._controllers.pop();
      
      if (controller) {
        controller.destroy();
      }
    }
  }

  public destroy() {
    this.removeAll();
    super.removeAllListeners();
  }

  protected _handlerControllerMove = (target: IVector2D) => {
    this.emit(CameraControllerEventTypes.MOVE, target);
  };

  protected _handlerControllerPOV = (target: IVector2D) => {
    this.emit(CameraControllerEventTypes.POV, target);
  };

  protected _handlerControllerZoom = (zoom: number) => {
    this.emit(CameraControllerEventTypes.ZOOM, zoom);
  };

  protected _handlerControllerRotate = (rotation: number) => {
    this.emit(CameraControllerEventTypes.ROTATE, rotation);
  };
}

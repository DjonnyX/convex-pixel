import * as PIXI from "pixi.js";
import { BaseContainer, BaseRoom, BaseConvexObject } from "../display/base";
import { CameraControllerEventTypes } from "../camera/controller";

export class P3DCameraProcessor {
  public get room() {
    return this._room;
  }

  private _lastTime: number | undefined;

  constructor(protected _room: BaseRoom) {
    if (!this._room) {
      throw Error(`Property "room" is not defined.`);
    }

    this.addCameraListeners();
  }

  public updatePOV(displayObject: BaseContainer) {
    const t = PIXI.Ticker.shared.lastTime;
    // check for debounce
    if (this._lastTime === t) return;

    const cam = this._room.camera;
    const object = displayObject instanceof BaseConvexObject ? displayObject : undefined;

    if (cam && object) {
      const sceneBounds = this._room.roomBound;

      const abs = object.getGlobalPosition ? object.getGlobalPosition() : undefined;

      const cx = (sceneBounds.width * 0.5 - (abs ? abs.x : 0)) * this._room.scale.x;
      const cy = (sceneBounds.height * 0.5 - (abs ? abs.y : 0)) * this._room.scale.y;

      const sx = -(cam.pov.x - cx) * cam.xOffset;
      const sy = -(cam.pov.y - cy) * cam.yOffset;

      const povX = sx * 0.01 * cam.povFactor * object.scale.x;
      const povY = sy * 0.01 * cam.povFactor * object.scale.y;

      object.setPOV(povX * object.scale.x, povY * object.scale.y);
      if (object.config.isBackground) {
        // static. etc...
      } else {
        if (object.container) {
          object.container.x = object.config.depth * povX;
          object.container.y = object.config.depth * povY;
        }
      }
    }
    if (displayObject.children) {
      for (const child of displayObject.children) {
        this.updatePOV(child as any);
      }
    }
  }

  public destroy() {
    this.removeCameraListeners();
  }

  protected updatePositions() {
    this._room.x = -this._room.camera.x;
    this._room.y = -this._room.camera.y;
  }

  protected _handlerCameraChangePosition = (e: PIXI.interaction.InteractionEvent) => {
    this.updatePositions();
  };

  protected _handlerCameraChangePOV = (e: PIXI.interaction.InteractionEvent) => {
    this.updatePOV(this._room);
  };

  protected _handlerCameraChangeZoom = (e: PIXI.interaction.InteractionEvent) => {
    this._room.scale.x = this._room.scale.y = this._room.camera.maxZoom;
    // this.updatePositions(this._scene);
  };

  protected _handlerCameraChangeRotate = (e: PIXI.interaction.InteractionEvent) => {
    // this.updatePositions(this._scene);
  };

  protected addCameraListeners() {
    const cam = this._room.camera;
    if (!cam) throw new Error("The camera is not defined");

    cam.addListener(CameraControllerEventTypes.MOVE, this._handlerCameraChangePosition);
    cam.addListener(CameraControllerEventTypes.POV, this._handlerCameraChangePOV);
    cam.addListener(CameraControllerEventTypes.ZOOM, this._handlerCameraChangeZoom);
    cam.addListener(CameraControllerEventTypes.ROTATE, this._handlerCameraChangeRotate);
  }

  protected removeCameraListeners() {
    const cam = this._room.camera;
    if (!cam) throw new Error("The camera is not defined");

    cam.removeListener(CameraControllerEventTypes.POV, this._handlerCameraChangePosition);
    cam.removeListener(CameraControllerEventTypes.MOVE, this._handlerCameraChangePOV);
    cam.removeListener(CameraControllerEventTypes.ZOOM, this._handlerCameraChangeZoom);
    cam.removeListener(CameraControllerEventTypes.ROTATE, this._handlerCameraChangeRotate);
  }
}

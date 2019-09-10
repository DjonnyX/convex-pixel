import * as PIXI from "pixi.js";
import { App } from "./app";
import { Rect, Vector4D } from "../utils/geom";
import { BaseConvexObject } from "../display/base";

interface ISyncEntity {
  id: string | number;
  groupId: number | string;
  object: BaseConvexObject;
}

export enum EventTypes {
  CHANGE = "change",
}

/**
 * Sinchronization p3d objects in dom space
 */
export class DomSynchronizer<C extends App = any> extends PIXI.utils.EventEmitter {
  private static _syncronizedObjects = new Array<ISyncEntity>();
  private static _instance: DomSynchronizer;

  public static add(syncEntity: ISyncEntity) {
    DomSynchronizer._instance.add(syncEntity);
  }

  constructor(public readonly context: C) {
    super();
    DomSynchronizer._instance = this;
    context.pixi.renderer.addListener("prerender", this._postrenderHandler);
  }

  public init(...params: any[]) {}

  public destroy(...params: any[]) {}

  public add(syncEntity: ISyncEntity) {
    if (DomSynchronizer._syncronizedObjects.indexOf(syncEntity) === -1) {
      DomSynchronizer._syncronizedObjects.push(syncEntity);
    }
  }

  private _postrenderHandler = () => {
    const map: {
      [x: string]: ISyncEntity[];
    } = {};
    for (const obj of DomSynchronizer._syncronizedObjects) {
      if (!map[obj.groupId]) {
        map[obj.groupId] = [];
      }
      map[obj.groupId].push(obj);
    }

    const dementions: {
      [x: string]: {
        width: number;
        height: number;
        x: number;
        y: number;
        id: number | string;
      };
    } = {};

    // tslint:disable-next-line: forin
    for (const id in map) {
      if (!dementions[id]) {
        dementions[id] = { width: 0, height: 0, x: 0, y: 0, id };
      }
      const demention = dementions[id];
      const len = map[id].length;
      const bound = Rect.new();
      for (const obj of map[id]) {
        const abs = obj.object.container ? obj.object.container.getGlobalPosition() : obj.object.getGlobalPosition();
        const bounds = obj.object.getBounds();
        const helper = Vector4D.new(abs.x, abs.y, abs.x + bounds.width, abs.y + bounds.height);
        bound.set(
          Math.min(bound.x || helper.x, helper.x),
          Math.min(bound.y || helper.y, helper.y),
          Math.max(bound.width || helper.z, helper.z),
          Math.max(bound.height || helper.t, helper.t)
        );

        // unlink for best perfomance
        helper.free();
        // abs.free();
      }
      demention.x = bound.x;
      demention.y = bound.y;
      demention.width = bound.width - bound.x;
      demention.height = bound.height - bound.y;

      // unlink for best perfomance
      bound.free();
    }

    this.emit(EventTypes.CHANGE, dementions);
  };
}

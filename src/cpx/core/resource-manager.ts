import * as PIXI from "pixi.js";
import { IConvexObjectConfig } from "../display/convex-object";

export interface IResources {
  [x: string]: IConvexObjectConfig;
}

export class ResourceManager {
  private static _instance: ResourceManager | undefined;

  private static _resources: IResources | undefined;

  public static get resources() {
    return this._resources;
  }

  public static getResource(name: string) {
    if (!this._resources) return null;

    const res = this._resources[name];
    if (res) {
      if (res.diffuseMap) {
        res.diffuseMapTexture = PIXI.Texture.from(res.diffuseMap);
      }
      if (res.depthMap) {
        res.depthMapTexture = PIXI.Texture.from(res.depthMap);
      }
      return res;
    }
    return null;
  }

  constructor(resources: IResources) {
    if (ResourceManager._instance) {
      return;
      // throw new Error("The resource manager already created. (singletone)");
    }

    ResourceManager._instance = this;
    ResourceManager._resources = resources;
  }

  public dispose() {
    ResourceManager._resources = undefined;
    ResourceManager._instance = undefined;
  }

  public get resources() {
    return ResourceManager.resources;
  }
}

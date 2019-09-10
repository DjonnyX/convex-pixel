import * as PIXI from "pixi.js";
import { MapTypes } from "../material";
import { BaseContainer } from "./base-container";
import { App } from "../../core/app";

interface IResources<T = any> {
  diffuse?: T;
  depth?: T;
  [x: string]: any;
}

export interface IBaseConvexObjectConfig {
  diffuseMap: string;
  depthMap?: string;
}

export class BaseConvexObject<T extends App = any, C extends IBaseConvexObjectConfig = any> extends BaseContainer {
  protected _diffuseMapSprite: PIXI.Sprite | undefined;

  protected _depthMapSprite: PIXI.Sprite | undefined;

  protected _container: PIXI.Container | undefined;

  protected _textures: IResources<PIXI.Texture> = { diffuse: undefined, depth: undefined };

  protected _displacementFilter: PIXI.filters.DisplacementFilter | undefined;

  protected _loader: PIXI.Loader | undefined;

  protected _filters: PIXI.Filter[] = [];

  constructor(public readonly context: T, public readonly stage: BaseContainer, protected _config: C) {
    super(context, stage);

    this.initialize();
  }

  /**
   * Setupt the POV-effect weights
   */
  public setPOV(x: number, y: number) {
    if (this._displacementFilter) {
      this._displacementFilter.scale.x = x;
      this._displacementFilter.scale.y = y;
    }
  }

  public destroy() {
    if (this._loader) {
      this._loader.destroy();
    }

    if (this._diffuseMapSprite) {
      this.removeChild(this._diffuseMapSprite);
      this._diffuseMapSprite.destroy();
      this._diffuseMapSprite = undefined;
    }

    if (this._depthMapSprite) {
      this.removeChild(this._depthMapSprite);
      this._depthMapSprite.destroy();
      this._depthMapSprite = undefined;
    }

    if (this._container) {
      this.removeChild(this._container);
      this._container.destroy();
      this._container = undefined;
    }

    this._displacementFilter = undefined;

    super.destroy();
  }

  protected initialize() {
    this._container = new PIXI.Container();
    this.addChild(this._container);

    this._loader = new PIXI.Loader();

    if (this._config.diffuseMap) {
      this._loader.add(MapTypes.DIFFUSE, this._config.diffuseMap);
    }
    if (this._config.depthMap) {
      this._loader.add(MapTypes.DEPTH, this._config.depthMap);
    }

    this._loader.load((loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) => {
      if (resources.diffuse) {
        this._textures.diffuse = resources.diffuse.texture;
      }
      if (resources.depth) {
        this._textures.depth = resources.depth.texture;
      }

      this.create();
    });
  }

  protected create() {
    if (!this._container) {
      throw new Error(`Property "container" is not defined.`);
    }

    if (this._textures.diffuse) {
      this._diffuseMapSprite = new PIXI.Sprite(this._textures.diffuse);
      this._container.addChild(this._diffuseMapSprite);

      if (this._textures.depth) {
        this._depthMapSprite = new PIXI.Sprite(this._textures.depth);
        this._depthMapSprite.width = this._diffuseMapSprite.width;
        this._depthMapSprite.height = this._diffuseMapSprite.height;

        this._container.addChild(this._depthMapSprite);

        this._displacementFilter = new PIXI.filters.DisplacementFilter(this._depthMapSprite, 0);
        this._displacementFilter.autoFit = true;
        this._filters.push(this._displacementFilter);
      }

      this.loadingComplete();
    }
  }

  /**
   * Calling when loading is fineshed
   */
  protected loadingComplete() {
    if (this._diffuseMapSprite) {
      this._diffuseMapSprite.filters = this._filters;
    }

    // this.dispatcher.dispatchEventWith("resize", true);
  }

  public get container() {
    return this._container;
  }

  public get config() {
    return this._config;
  }
}

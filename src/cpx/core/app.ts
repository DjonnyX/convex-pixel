import * as PIXI from "pixi.js";
import { sonar as SonarUtils } from "../utils/package";
import { BaseRoom } from "../display/base";
import { DomSynchronizer } from "./dom-synchronizer";

export interface IAppConfig {
  view: HTMLElement;
  transparent?: boolean;
  antialias?: boolean;
  preserveDrawingBuffer?: boolean;
  resolution?: number;
  forceCanvas?: boolean;
  backgroundColor?: number;
  clearBeforeRender?: boolean;
  forceFXAA?: boolean;
  powerPreference?: string;
  sharedLoader?: boolean;
  sharedTicker?: boolean;
}

export class App<R extends BaseRoom = any> {
  public get room() {
    return this._room;
  }

  public get domSynchronizer() {
    return this._domSynchronizer;
  }

  public readonly pixi: PIXI.Application;

  protected _viewDomElement: HTMLElement;

  protected _room: R | undefined;

  protected _domSynchronizer: DomSynchronizer | undefined;

  private _stageSonarResizeDetector: SonarUtils.SonarDetector | undefined;

  private _domElementResizeSonarDetector: SonarUtils.SonarDetector | undefined;

  constructor(config: IAppConfig) {
    SonarUtils.Sonar.create().run();

    this._viewDomElement = config.view;

    this.pixi = new PIXI.Application({
      antialias: config.antialias,
      transparent: config.transparent,
      sharedLoader: config.sharedLoader,
      sharedTicker: config.sharedTicker,
      preserveDrawingBuffer: config.preserveDrawingBuffer,
      resolution: config.resolution,
      forceCanvas: config.forceCanvas,
      backgroundColor: config.backgroundColor,
      clearBeforeRender: config.clearBeforeRender,
      forceFXAA: config.forceFXAA,
      powerPreference: config.powerPreference,
    });

    this._domSynchronizer = new DomSynchronizer(this);

    this._viewDomElement.appendChild(this.pixi.view);

    this.pixi.ticker.add(this.tick, 9999);
  }

  public setRoom(room: R) {
    this._room = room;
  }

  public destroy() {
    SonarUtils.Sonar.instance.destroy();

    this.pixi.destroy();
  }

  protected tick = () => {
    let needResize = false;
    if (this.pixi.view.width !== this._viewDomElement.offsetWidth) {
      this.pixi.view.width = this._viewDomElement.offsetWidth;
      needResize = true;
    }
    if (this.pixi.view.height !== this._viewDomElement.offsetHeight) {
      this.pixi.view.height = this._viewDomElement.offsetHeight;
      needResize = true;
    }

    if (needResize) this.resize(this.pixi.view.width, this.pixi.view.height);
  };

  protected resize(width: number, height: number) {
    // etc
  }
}

import * as PIXI from "pixi.js";
import { sonar as SonarUtils } from "../utils/package";
import { BaseRoom } from "../display/base";
import { DomSynchronizer } from "./dom-synchronizer";

export interface IAppConfig {
  view: HTMLElement;
  transparent?: boolean;
}

export class App<R extends BaseRoom = any> {

  public static get instance() {
    return this._instance;
  }

  private static _instance: App;

  public get room() { return this._room; }

  public readonly pixi: PIXI.Application;

  protected _viewDomElement: HTMLElement;

  protected _room: R | undefined;

  protected _domSynchronizer: DomSynchronizer | undefined;

  private _stageSonarResizeDetector: SonarUtils.SonarDetector | undefined;

  private _domElementResizeSonarDetector: SonarUtils.SonarDetector | undefined;

  public get domSynchronizer() {
    return this._domSynchronizer;
  }

  constructor(config: IAppConfig) {
    SonarUtils.Sonar.create().run();

    this._viewDomElement = config.view;

    this.pixi = new PIXI.Application({
      antialias: false,
      transparent: config.transparent,
      sharedLoader: true,
      sharedTicker: true,
      preserveDrawingBuffer: true
    });
    App._instance = this;

    this._domSynchronizer = new DomSynchronizer();

    this._viewDomElement.appendChild(this.pixi.view);

    this.addListeners();
  }

  public setRoom(room: R) {
    this._room = room;
  }

  public destroy() {
    SonarUtils.Sonar.instance.destroy();

    this.pixi.destroy();
  }

  protected resize(width: number, height: number) {
    // etc
  }

  private _domElementResizeHandler = () => {
    this.pixi.view.width = this._viewDomElement.offsetWidth;
    this.pixi.view.height = this._viewDomElement.offsetHeight;
  };

  private addListeners() {
    document.addEventListener("resize", this._domElementResizeHandler);

    this._domElementResizeSonarDetector = new SonarUtils.SonarDetector(
      this._viewDomElement,
      ["offsetWidth", "offsetHeight"],
      "resize"
    );
    this._domElementResizeSonarDetector.detectChanges(true);
    this._domElementResizeSonarDetector.addListener(
      "resize",
      this._domElementResizeHandler
    );

    this._stageSonarResizeDetector = new SonarUtils.SonarDetector(
      this.pixi.view,
      ["width", "height"],
      "resize"
    );
    this._stageSonarResizeDetector.detectChanges(true);
    this._stageSonarResizeDetector.addListener(
      "resize",
      this._stageResizeHandler
    );
  }

  private _stageResizeHandler = () => {
    this.resize(this.pixi.view.width, this.pixi.view.height);
  };
}

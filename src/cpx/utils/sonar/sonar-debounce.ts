import * as PIXI from "pixi.js";
import { SonarEventTypes } from "./sonar";

const DEFAULT_TIMEOUT = 500;

export class SonarDebounce extends PIXI.utils.EventEmitter {

  public get eventType() {
    return this._eventType;
  }

  protected _timeout: number;

  protected _eventType: SonarEventTypes | undefined;

  private _timeoutId: any;

  private _nextTimeoutId: any;

  constructor( timeout = DEFAULT_TIMEOUT, eventType = SonarEventTypes.CHANGE ) {
    super();
    this._timeout = timeout;
    this._eventType = eventType;
  }

  public detectChanges(nextStep = false) {
    if (nextStep) {
      this._detectChangesNextFrame();
      return;
    }

    if (!this._eventType) {
      throw Error("Property \"eventType\" is not defined.");
    }
    this.emit(this._eventType);
  }

  public detect() {
    clearTimeout(this._timeoutId);
    this._timeoutId = setTimeout(this._detectChangesHandler, this._timeout);
  }

  public stop() {
    clearTimeout(this._timeoutId);
    clearTimeout(this._nextTimeoutId);
  }

  public destroy() {
    this.stop();

    this.removeAllListeners();
  }

  private _detectChangesNextFrame() {
    clearTimeout(this._nextTimeoutId);
    this._nextTimeoutId = setTimeout(this._detectChangesHandler, 0);
  }

  private _detectChangesHandler = (nextStep = false) => {
    this.detectChanges(nextStep);
  };
}

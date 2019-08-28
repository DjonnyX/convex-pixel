import * as PIXI from "pixi.js";
import { SonarEventTypes, Sonar } from "./sonar";

export class SonarDetector<T extends {[x: string]: any} = object> extends PIXI.utils.EventEmitter {
  private _snapshot: any = {};

  private _nextTimeoutId: any;

  constructor(
    protected _object: T | undefined,
    protected _detectedProps: string[] | undefined,
    protected _eventType: string = SonarEventTypes.CHANGE
  ) {
    super();

    this.startDetection();
  }

  public detectChanges(nextStep = false) {
    if (nextStep) {
      this._detectChangesNextFrame();
      return;
    }

    if (!this._object) {
      this.emit(SonarEventTypes.LOST_CONTEXT);
      return;
    }

    if (!this.detectedProps) {
      throw Error("Property \"detectedProps\" is not defined.");
    }

    for (const prop of this.detectedProps) {
      const current = this._object;
      const previous = this._snapshot;
      if (current[prop] !== previous[prop]) {
        previous[prop] = current[prop];
        this.emit(this._eventType);
        break;
      }
    }
  }

  public destroy() {
    this.stopDetection();

    this.removeAllListeners();

    this._object = undefined;
    this._snapshot = undefined;
    this._detectedProps = undefined;
  }

  protected startDetection() {
    Sonar.instance.add(this);
  }

  protected stopDetection() {
    clearTimeout(this._nextTimeoutId);

    if (Sonar.instance) {
      Sonar.instance.remove(this);
    }
  }

  public get detectedProps() {
    return this._detectedProps;
  }

  public get eventType() {
    return this._eventType;
  }

  private _detectChangesNextFrame() {
    clearTimeout(this._nextTimeoutId);
    this._nextTimeoutId = setTimeout(this._detectChangesHandler, 0);
  }

  private _detectChangesHandler = (nextStep = false) => {
    this.detectChanges(nextStep);
  }
}

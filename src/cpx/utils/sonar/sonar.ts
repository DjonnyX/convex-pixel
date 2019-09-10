import { SonarDetector } from "./sonar-detector";

const DEFAULT_INTERVAL = 500;

export enum SonarEventTypes {
  CHANGE = "change",
  LOST_CONTEXT = "lost-context",
}

export class Sonar {
  public static instance: Sonar;

  public static create() {
    if (!Sonar.instance) {
      Sonar.instance = new Sonar();
    }

    return Sonar.instance;
  }

  protected _interval: number | undefined;

  protected _poolDetectors = new Array<SonarDetector>();

  private _timerId: number | undefined = undefined;

  constructor(detectionInterval = DEFAULT_INTERVAL) {
    this._interval = detectionInterval;
  }

  public run() {
    this._timerId = setInterval(this._tickHandler, this._interval) as any;
  }

  public stop() {
    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = undefined;
    }
  }

  public add(detector: SonarDetector) {
    if (this._poolDetectors.indexOf(detector) > -1) return; // throw new Error('The detector is already added to pool');

    this._poolDetectors.push(detector);
  }

  public remove(detector: SonarDetector) {
    const index = this._poolDetectors.indexOf(detector);
    if (index === -1) return; // throw new Error('The detector is already removed');

    this._poolDetectors.splice(index, 1);
  }

  public removeAll() {
    while (this._poolDetectors.length > 0) {
      const detector = this._poolDetectors.pop();
      if (detector) {
        detector.destroy();
      }
    }
  }

  public destroy() {
    this.stop();
    this.removeAll();

    this._poolDetectors.length = 0;
  }

  private _tickHandler = () => {
    for (let i = 0, l = this._poolDetectors.length; i < l; i++) {
      this._poolDetectors[i].detectChanges();
    }
  };
}

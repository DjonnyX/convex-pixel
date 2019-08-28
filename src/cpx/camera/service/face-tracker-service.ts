import * as PIXI from "pixi.js";

const SKIP_FRAMSE = 3;
const TRESHOLD = 0.05;

/**
 * Service for tobii or openmv_fp
 */
export class FaceTrackerService extends PIXI.utils.EventEmitter {
  protected _client: WebSocket;

  protected _poss = [[0, 0], [0, 0], [0, 0], [0, 0]];

  protected _prev: number[] | undefined;

  protected _f = SKIP_FRAMSE;

  constructor() {
    super();

    // put in the config
    this._client = new WebSocket("ws://127.0.0.1:8084/");

    // handle connections
    // this._client.onopen = this._openHandler;
    // this._client.onerror = this._errorHandler;
    this._client.onmessage = this._messageHandler;
  }

  public destroy() { }

  private _errorHandler = (client: WebSocket, ev: Event) => {
    // need handler...
  };

  private _messageHandler = (evt: any) => {
    /*this._f--;
    if (this._f > 0) return;
    this._f = SKIP_FRAMSE;*/

    if (String(evt.data).indexOf(":") !== -1) {
      const data = String(evt.data)
        .split(":")
        .map(v => Number(v));
      if (
        this._prev &&
        (data[0] === this._prev[0] || data[1] === this._prev[0])
      ) {
        return;
      }

      this._poss.shift();
      this._poss.push(data);

      const total = this._poss.length;
      let sx = 0;
      let sy = 0;
      for (let i = 0; i < total; i++) {
        sx += this._poss[i][0];
        sy += this._poss[i][1];
      }

      this._prev = data;
      this.emit("move", { x: sx / total, y: sy / total });
      // tslint:disable-next-line: no-console
    } else console.log(evt.data);
  };
}

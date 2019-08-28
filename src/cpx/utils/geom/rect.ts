import { Vector2D, IVector2D } from "./vector";

export interface IRect extends IVector2D {
  width: number;
  height: number;
}

export class Rect implements IRect {
  private static _pool = new Array<Rect>();

  public static get poolCount() {
    return this._pool.length;
  }

  public static new(x = 0, y = 0, width = 0, height = 0): Rect {
    if (Rect._pool.length > 0) {
      const rect = Rect._pool.pop();
      if (rect) {
      return rect
        .setPosition(x, y)
        .setSize(width, height);
      }
    }

    return new Rect(x, y, width, height);
  }

  constructor(
    public x = 0,
    public y = 0,
    public width = 0,
    public height = 0
  ) {}

  public set(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    return this;
  }

  public setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  public setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    return this;
  }

  public reset() {
    this.x = this.y = this.width = this.height;
  }

  public free() {
    this.reset();
    Rect._pool.push(this);
  }

  public valueOf() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}

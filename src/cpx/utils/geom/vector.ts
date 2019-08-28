export interface IVector2D {
  x: number;
  y: number;
}

export interface IVector3D extends IVector2D {
  z: number;
}

export interface IVector4D extends IVector3D {
  t: number;
}

/**
 * Vector2D
 * Uses pooling for speed performance
 */
export class Vector2D implements IVector2D {
  private static _pool = new Array<Vector2D>();

  public static get poolCount() {
    return this._pool.length;
  }

  public static new(x = 0, y = 0): Vector2D {
    if (Vector2D._pool.length > 0) {
      const vect = Vector2D._pool.pop();
      if (vect) {
        return vect.set(x, y);
      }
    }

    return new Vector2D(x, y);
  }

  constructor(public x = 0, public y = 0) {}

  public set(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  public from(vector2D: IVector2D) {
    this.x = vector2D.x;
    this.y = vector2D.y;
    return this;
  }

  public free() {
    Vector2D._pool.push(this);
  }

  public valueOf() {
    return { x: this.x, y: this.y };
  }
}

// tslint:disable-next-line: max-classes-per-file
export class Vector3D implements IVector3D {

  private static _pool = new Array<Vector3D>();

  public static get poolCount() {
    return this._pool.length;
  }

  public static new(x = 0, y = 0, z = 0): Vector3D {
    if (Vector3D._pool.length > 0) {
      const vect = Vector3D._pool.pop();
      if (vect) {
        return vect.set(x, y, z);
      }
    }

    return new Vector3D(x, y, z);
  }

  constructor(public x = 0, public y = 0, public z = 0) { }

  public set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  public free() {
    Vector3D._pool.push(this);
  }

  public valueOf() {
    return { x: this.x, y: this.y, z: this.z };
  }
}

// tslint:disable-next-line: max-classes-per-file
export class Vector4D implements IVector4D {

  private static _pool = new Array<Vector4D>();

  public static get poolCount() {
    return this._pool.length;
  }

  public static new(x = 0, y = 0, z = 0, t = 0): Vector4D {
    if (Vector4D._pool.length > 0) {
      const vect = Vector4D._pool.pop();
      if (vect) {
        return vect.set(x, y, z, t);
      }
    }

    return new Vector4D(x, y, z, t);
  }

  constructor(public x = 0, public y = 0, public z = 0, public t = 0) { }

  public set(x: number, y: number, z: number, t: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.t = t;
    return this;
  }

  public free() {
    Vector4D._pool.push(this);
  }

  public valueOf() {
    return { x: this.x, y: this.y, z: this.z, t: this.t };
  }
}

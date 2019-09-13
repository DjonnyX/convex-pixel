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

  /**
   * @deprecated
   */
  public move(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  public from(vector: IVector2D) {
    this.x = vector.x;
    this.y = vector.y;
    return this;
  }

  public free() {
    Vector2D._pool.push(this);
  }

  public valueOf() {
    return { x: this.x, y: this.y };
  }

  public clone(): Vector2D {
    return Vector2D.new(this.x, this.y);
  }

  public add(vector: Vector2D, isClone = true): Vector2D {
    if (!isClone) {
      this.x += vector.x;
      this.y += vector.y;
      return this;
    }
    return Vector2D.new(this.x + vector.x, this.y + vector.y);
  }

  public deduct(vector: IVector2D, isClone = true) {
    if (!isClone) {
      this.x -= vector.x;
      this.y -= vector.y;
      return this;
    }
    return Vector2D.new(this.x - vector.x, this.y - vector.y);
  }

  public measureDistance(vector: IVector2D, xAxis = true, yAxis = true) {
    const a = Math.max(this.x, vector.x) - Math.min(this.x, vector.x);
    const b = Math.max(this.y, vector.y) - Math.min(this.y, vector.y);
    if (xAxis && yAxis) return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    else if (xAxis) return a;
    else if (yAxis) return b;
    return 0;
  }

  public comparePoint(vector: IVector2D) {
    return this.x === vector.x && this.y === vector.y;
  }

  public empty() {
    this.x = this.y = 0;
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

  constructor(public x = 0, public y = 0, public z = 0) {}

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

  constructor(public x = 0, public y = 0, public z = 0, public t = 0) {}

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

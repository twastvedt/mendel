export class Vector {
  constructor(private _x: number, private _y: number) {}

  private _length?: number;

  public distanceTo(other: Vector): number {
    return Math.sqrt((this._x - other.x) ** 2 + (this._y - other.y) ** 2);
  }

  public get x(): number {
    return this._x;
  }

  public set x(value: number) {
    this._x = value;
    delete this._length;
  }

  public get y(): number {
    return this._y;
  }

  public set y(value: number) {
    this._y = value;
    delete this._length;
  }

  public get length(): number {
    if (this._length === undefined) {
      this._length = Math.sqrt(this._x ** 2 + this._y ** 2);
    }

    return this._length;
  }

  public set length(value: number) {
    const factor = value / this.length;

    this._x *= factor;
    this._y *= factor;

    this._length = value;
  }

  public set(x: number, y: number): this {
    this.x = x;
    this.y = y;

    return this;
  }

  public normalize(): this {
    this.length = 1;

    return this;
  }

  public subtract(other: Vector): this {
    this.x -= other.x;
    this.y -= other.y;

    return this;
  }

  public add(other: Vector): this {
    this.x += other.x;
    this.y += other.y;

    return this;
  }

  public static fromArray(numbers: number[]): Vector {
    return new Vector(numbers[0], numbers[1]);
  }

  public static subtract(a: Vector, b: Vector, target?: Vector): Vector {
    if (target) {
      return target.set(a.x - b.x, a.y - b.y);
    } else {
      return new Vector(a.x - b.x, a.y - b.y);
    }
  }

  public static add(a: Vector, b: Vector, target?: Vector): Vector {
    if (target) {
      return target.set(a.x + b.x, a.y + b.y);
    } else {
      return new Vector(a.x + b.x, a.y + b.y);
    }
  }
}

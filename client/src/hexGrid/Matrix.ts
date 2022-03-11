import { Vector } from "../Vector";

export class Matrix {
  constructor(
    public a: number,
    public b: number,
    public c: number,
    public d: number
  ) {}

  multiplyVector(vector: Vector): Vector {
    return new Vector(
      this.a * vector.x + this.b * vector.y,
      this.c * vector.x + this.d * vector.y
    );
  }

  multiplyMatrix(m: Matrix): Matrix {
    return new Matrix(
      this.a * m.a + this.b * m.c,
      this.a * m.b + this.b * m.d,
      this.c * m.a + this.d * m.c,
      this.c * m.b + this.d * m.d
    );
  }

  get determinant(): number {
    return 1 / (this.a * this.d - this.b * this.c);
  }

  inverse(): Matrix {
    const d = this.determinant;

    return new Matrix(d * this.d, -d * this.b, -d * this.c, d * this.a);
  }
}

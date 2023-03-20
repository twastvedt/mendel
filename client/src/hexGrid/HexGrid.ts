import type { Position } from "@mendel/common";
import { Vector } from "../Vector";
import { Hex } from "./Hex";
import { Matrix } from "./Matrix";

const sqrt3 = Math.sqrt(3);

export class HexGrid {
  public basis!: Matrix;

  public basisInv!: Matrix;

  /**
   *
   * @param angle Grid rotation in radians.
   */
  constructor(
    private _angle: number,
    public origin: Vector,
    private _size: number
  ) {
    this.setBasis();
  }

  get size(): number {
    return this._size;
  }

  set size(value: number) {
    this._size = value;

    this.setBasis();
  }

  get angle(): number {
    return this._angle;
  }

  set angle(value: number) {
    this._angle = value;

    this.setBasis();
  }

  private setBasis(): void {
    this.basis = new Matrix(
      Math.cos(this.angle),
      -Math.sin(this.angle),
      Math.sin(this.angle),
      Math.cos(this.angle)
    ).multiplyMatrix(
      new Matrix(
        this._size * sqrt3,
        (this._size * sqrt3) / 2,
        0,
        (this._size * 3) / 2
      )
    );

    this.basisInv = this.basis.inverse();
  }

  convertTo(coordinate: Position, round = false): Hex {
    const relativeC = new Vector(
      coordinate[0] - this.origin.x,
      coordinate[1] - this.origin.y
    );

    const qr = this.basisInv.multiplyVector(relativeC);

    if (round) {
      return new Hex(qr.x, qr.y).round();
    } else {
      return new Hex(qr.x, qr.y);
    }
  }

  convertFrom(hex: Hex): Vector {
    return this.basis.multiplyVector(hex.toVector()).add(this.origin);
  }
}

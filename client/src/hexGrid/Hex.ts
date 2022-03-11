import { Vector } from "../Vector";

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export class Hex {
  [key: number]: number;

  private _array?: [number, number, number];

  public readonly s: number;

  get asArray(): [number, number, number] {
    if (!this._array) {
      this._array = [this.q, this.r, this.s];
    }

    return this._array;
  }

  constructor(public readonly q: number, public readonly r: number) {
    this.s = -q - r;
  }

  get 0(): number {
    return this.q;
  }

  get 1(): number {
    return this.q;
  }

  get 2(): number {
    return this.q;
  }

  lerp(b: Hex, t: number): Hex {
    return new Hex(lerp(this.q, b.q, t), lerp(this.r, b.r, t));
  }

  round(): Hex {
    let q = Math.round(this.q);
    let r = Math.round(this.r);
    const s = Math.round(this.s);

    const q_diff = Math.abs(q - this.q);
    const r_diff = Math.abs(r - this.r);
    const s_diff = Math.abs(s - this.s);

    if (q_diff > r_diff && q_diff > s_diff) {
      q = -r - s;
    } else if (r_diff > s_diff) {
      r = -q - s;
    }

    return new Hex(q, r);
  }

  subtract(b: Hex): Hex {
    return new Hex(this.q - b.q, this.r - b.r);
  }

  add(b: Hex): Hex {
    return new Hex(this.q + b.q, this.r + b.r);
  }

  distance(b: Hex): number {
    const vec = this.subtract(b);
    return (Math.abs(vec.q) + Math.abs(vec.r) + Math.abs(vec.s)) / 2;
  }

  lineTo(b: Hex): Hex[] {
    const N = this.distance(b);

    const results = [] as Hex[];

    for (let i = 0; i <= N; i++) {
      results.push(this.lerp(b, (1.0 / N) * i).round());
    }
    return results;
  }

  equals(b?: Hex): boolean {
    return !!b && this.q === b.q && this.r === b.r;
  }

  toVector(): Vector {
    return new Vector(this.q, this.r);
  }
}

import { Bed } from "@/entity/Bed";
import { Garden } from "@/entity/Garden";
import { Position } from "@/entity/geoJson";

interface Result {
  type: "fill" | "stroke";
  index: number;
}

export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private colorIds = new Map<number, Result>();

  constructor(private garden: Garden, private snapDistance: number) {
    this.canvas = document.createElement("canvas");
    const context = this.canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not get canvas context.");
    }

    context.lineWidth = snapDistance * 2;

    const colorStep = (0xffffff / garden.beds.length) * 2;

    let color = colorStep;

    garden.beds.forEach((b, index) => {
      const path = this.toPath(b.shape.coordinates[0]);

      context.fillStyle = "#" + color.toString(16).padStart(6, "0");

      this.colorIds.set(color, { type: "fill", index });

      context.fill(path);

      color += colorStep;

      context.strokeStyle = "#" + color.toString(16).padStart(6, "0");

      this.colorIds.set(color, { type: "stroke", index });

      context.stroke(path);

      color += colorStep;
    });

    this.context = context;
  }

  testPoint(point: Position): Result | undefined {
    const data = this.context.getImageData(...point, 1, 1).data;

    const color = data[0] * 256 * 256 + data[1] * 256 + data[2];

    return this.colorIds.get(color);
  }

  toPath(polygon: Position[]): Path2D {
    const path = new Path2D();

    path.moveTo(...polygon[0]);

    for (let i = 1; i < polygon.length; i++) {
      path.lineTo(...polygon[i]);
    }

    path.closePath();

    return path;
  }
}

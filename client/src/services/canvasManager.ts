import { useGardenStore } from "@/state/gardenStore";
import type { Position } from "@mendel/common";
import { interpolateRgbBasis } from "d3-interpolate";

export class BackgroundImage {
  blobUrl?: string;
  width = 0;
  height = 0;
  offset = [0, 0] as Position;
  margin = 18;
  /**
   * Factor to grow areas. Defaults to fill gaps in circle packing.
   */
  grow = 2 / Math.sqrt(3);

  resolution = 2;
  offscreen = new OffscreenCanvas(500, 500);
  context: OffscreenCanvasRenderingContext2D;
  gardenStore = useGardenStore();
  blur = 24;
  colorRange = ["#ff0000", "white", "#00ff00"];
  dataRange = [-5, 5] as [number, number];

  constructor() {
    const context = this.offscreen.getContext("2d");
    if (!context) {
      throw new Error("Could not get canvas context.");
    }
    this.context = context;
  }

  async update() {
    if (!this.gardenStore.grid) {
      throw new Error("Grid needed");
    }

    const colorInterpolater = interpolateRgbBasis(this.colorRange);
    const interpolater = (v: number) =>
      colorInterpolater(
        (v - this.dataRange[0]) / (this.dataRange[1] - this.dataRange[0]),
      );

    const bounds = this.gardenStore.grid.bounds.reduce((b, n) => [
      Math.min(b[0], n[0]),
      Math.min(b[1], n[1]),
      Math.max(b[2], n[2]),
      Math.max(b[3], n[3]),
    ]);

    this.width = bounds[2] - bounds[0] + this.margin * 2;
    this.height = bounds[3] - bounds[1] + this.margin * 2;
    this.offset = [bounds[0] - this.margin, -bounds[3] - this.margin];

    const transform = (c: Position) =>
      [
        (c[0] + this.margin - bounds[0]) * this.resolution,
        (-c[1] + this.margin + bounds[3]) * this.resolution,
      ] as Position;

    this.offscreen.width = this.width * this.resolution;
    this.offscreen.height = this.height * this.resolution;
    this.context.filter = `blur(${this.blur}px)`;

    this.gardenStore.currentPlan?.plantings.forEach((pl) => {
      if (pl.variety?.family?.nitrogen) {
        this.context.fillStyle = interpolater(pl.variety.family.nitrogen);
        pl.plants.forEach((p) => {
          this.context.beginPath();
          this.context.arc(
            ...transform(p.location.coordinates),
            (pl.variety!.family!.spacing / 2) * this.grow * this.resolution,
            0,
            2 * Math.PI,
          );
          this.context.fill();
        });
      }
    });

    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
    }

    this.blobUrl = URL.createObjectURL(await this.offscreen.convertToBlob());
  }

  drawFuzzyCircle(location: Position, radius: number, blur = 0) {
    const circle = new Path2D();
    circle.arc(...location, radius + blur / 2, 0, 2 * Math.PI);
    const gradient = this.context.createRadialGradient(
      ...location,
      radius - blur / 2,
      ...location,
      radius + blur / 2,
    );

    gradient.addColorStop(0, "black");
    gradient.addColorStop(1, "transparent");

    this.context.fillStyle = gradient;
    this.context.fill(circle);
  }
}

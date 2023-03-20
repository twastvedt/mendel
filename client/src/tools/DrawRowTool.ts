import { Variety, Planting } from "@mendel/common/src";
import type { Position } from "@mendel/common";
import type { Tool } from "./Tool";
import { AddPlantingAction } from "../actions/AddPlantingAction";
import type { Action } from "../actions/Action";
import { state } from "../state/State";
import drawPlantRow from "../components/DrawPlantRow.vue";
import { polygonTrimRay } from "../geometry/polygonTools";
import { Vector } from "../Vector";
import type { UiElementType } from "../types/entityTypes";

export class DrawRowTool implements Tool {
  private index?: number;
  private rotation = 0;
  private ray = new Vector(0, 0);
  private segment?: [number, number];

  public constructor(private variety: Variety) {}

  public interactiveElements = new Set<UiElementType>(["area"]);

  public cursorComponent = drawPlantRow;
  public cursorProps = {
    cursor: null as Position | null,
    locations: [] as Position[],
    planting: null as Planting | null,
    rotationCenter: null as Position | null,
  };

  public get helpText(): string {
    return "Click in a bed to create a row. Hold control to rotate.";
  }

  public start(): void {
    const planting = new Planting();
    planting.variety = this.variety;
    planting.varietyId = this.variety.id;
    planting.shape = {
      type: "LineString",
      coordinates: [[0, 0]],
    };

    if (!this.variety.family) {
      throw new Error("No family on variety?");
    }

    this.cursorProps.planting = planting;

    if (!document.hasFocus()) {
      window.focus();
      console.log("window focused");
    }

    addEventListener("keydown", this.onKeyDown);
    addEventListener("keyup", this.onKeyUp);
  }

  public stop(): void {
    removeEventListener("keydown", this.onKeyDown);

    removeEventListener("keyup", this.onKeyUp);

    this.cursorProps.planting = null;
  }

  public onCursorMove(point: Position): void {
    this.cursorProps.cursor = point;

    this.updateRow(point);
  }

  public onHover(point: Position, index?: number): void {
    if (!this.cursorProps.planting?.shape) {
      return;
    }

    if (this.cursorProps.rotationCenter) {
      this.index = index;
    } else if (index != undefined) {
      if (this.index !== index) {
        if (!document.hasFocus()) {
          window.focus();
          console.log("window focused");
        }

        this.index = index;
      }
    } else {
      // Only clear the planting display if we aren't currently rotating.
      this.clearDisplay();
    }
  }

  public onClick(): Action | void {
    if (this.cursorProps.planting && this.index !== undefined) {
      return new AddPlantingAction(
        Planting.cleanCopy(this.cursorProps.planting)
      );
    }
  }

  private pointOnRow(t: number): Position {
    const cursor = this.cursorProps.cursor;

    if (!cursor) {
      throw new Error("Can't make point without cursor defined.");
    }

    return [cursor[0] + t * this.ray.x, cursor[1] + t * this.ray.y];
  }

  private updateRow(point: Position): void {
    const props = this.cursorProps;

    const spacing = this.variety.family?.spacing;

    if (!spacing || !props.planting?.shape || !state.db) {
      return;
    }

    if (props.rotationCenter) {
      this.rotation = Math.atan2(
        point[1] - props.rotationCenter[1],
        point[0] - props.rotationCenter[0]
      );
    }

    props.cursor = point;

    if (this.index !== undefined && props.locations) {
      const locations = props.locations;
      locations.length = 0;

      const bed = state.db.garden.beds[this.index];

      Vector.fromPolar(1, this.rotation, this.ray);

      this.segment = polygonTrimRay(bed.shape.coordinates[0], point, this.ray);

      if (this.segment) {
        for (
          let t = this.segment[0] - (this.segment[0] % spacing);
          t < this.segment[1];
          t += spacing
        ) {
          locations.push(this.pointOnRow(t));
        }

        props.planting.shape.coordinates = this.segment.map((p) =>
          this.pointOnRow(p)
        );
      }
    }
  }

  private clearDisplay(): void {
    if (this.cursorProps.planting?.shape) {
      this.cursorProps.planting.shape.coordinates = [[0, 0]];
      this.cursorProps.locations.length = 0;
    }

    delete this.index;
  }

  private onKeyDown = (event: KeyboardEvent) => {
    const props = this.cursorProps;

    if (
      event.ctrlKey &&
      !props.rotationCenter &&
      this.index !== undefined &&
      props.cursor
    ) {
      const r = 50 / state.scale;

      props.rotationCenter = [
        props.cursor[0] - r * Math.cos(this.rotation),
        props.cursor[1] - r * Math.sin(this.rotation),
      ];
    }
  };

  private onKeyUp = (event: KeyboardEvent) => {
    const props = this.cursorProps;

    if (event.key === "Control") {
      props.rotationCenter = null;

      if (this.index === undefined) {
        this.clearDisplay();
      }
    }
  };
}

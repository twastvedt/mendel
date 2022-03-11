import { Variety, Planting, Position } from "@mendel/common";
import { Tool } from "./Tool";
import { AddPlantingAction } from "../actions/AddPlantingAction";
import { Action } from "../actions/Action";
import { ElementType, state } from "../Store";
import drawPlanting from "../components/DrawPlanting.vue";
import { GridPoints, PolygonGrid } from "../services/polygonGrid";

export enum Stage {
  selecting,
  drawingLine,
  selectingAfterLine,
}

export class DrawPlantingTool implements Tool {
  private planting?: Planting;
  private index?: number;

  public constructor(private variety: Variety, private grid: PolygonGrid) {}

  public interactiveElements = new Set<ElementType>(["area"]);

  public cursorComponent = drawPlanting;
  public cursorProps = {
    cursor: null as Position | null,
    plants: null as GridPoints | null,
    planting: null as Planting | null,
    rotationCenter: null as Position | null,
    dividingLine: [] as Position[],
    stage: Stage.selecting,
    snapped: false,
  };

  public get helpText(): string {
    switch (this.cursorProps.stage) {
      case Stage.selecting:
        return "Click in a bed to fill it with plants. Hold control to rotate plant grid. Click on a bed's edge to divide it.";

      case Stage.drawingLine:
        return "Click to continue dividing the bed. Click on the bed's edge to finish.";

      case Stage.selectingAfterLine:
        return "Click in a bed to fill it with plants. Hold control to rotate plant grid.";
    }
  }

  public start(): void {
    this.planting = new Planting();
    this.planting.variety = this.variety;
    this.planting.varietyId = this.variety.id;
    this.planting.shape = {
      type: "Polygon",
      coordinates: [[[0, 0]]],
    };
    this.planting.gardenId = state.garden?.id;

    if (!this.variety.family) {
      throw new Error("Family required");
    }

    this.grid.diameter = this.variety.family.spacing;

    const props = this.cursorProps;

    props.planting = this.planting;

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

    if (this.planting) {
      state.removePlanting(this.planting);

      delete this.planting;
    }
  }

  public onCursorMove(point: Position): void {
    const props = this.cursorProps;

    props.cursor = point;

    switch (props.stage) {
      case Stage.selecting:
        if (!this.snapToBeds(point)) {
          props.dividingLine.splice(0, 1);
        }

        this.updateGrid(point);

        break;

      case Stage.drawingLine:
        if (!this.snapToBeds(point)) {
          props.dividingLine.splice(0, 1, point);
        }

        break;

      case Stage.selectingAfterLine:
        this.updateGrid(point);

        break;
    }
  }

  public onHover(point: Position, index?: number): void {
    if (!this.planting || this.cursorProps.stage === Stage.drawingLine) {
      return;
    }

    if (this.cursorProps.rotationCenter) {
      this.index = index;
    } else if (index != undefined) {
      this.planting.shape.coordinates = [this.grid.areas[index].polygon];
      this.grid.activeGrid = index;

      this.grid.setCursor(point);

      if (this.index !== index) {
        if (!document.hasFocus()) {
          window.focus();
          console.log("window focused");
        }

        this.cursorProps.plants = this.grid.grids[index];

        this.index = index;
      }
    } else if (this.cursorProps.stage === Stage.selecting) {
      // Only clear the planting display if we aren't currently rotating.
      // In final stage, never clear.

      this.clearDisplay();
    }
  }

  public onClick(point: Position): Action | void {
    const props = this.cursorProps;

    switch (props.stage) {
      case Stage.selecting:
        if (props.snapped) {
          // Snapped to the start of a dividing line.

          props.stage = Stage.drawingLine;
          props.dividingLine.unshift(point);
        } else {
          return this.finish();
        }

        break;

      case Stage.drawingLine:
        if (props.snapped) {
          if (this.index === undefined) {
            throw new Error("Index undefined when finishing dividing line?");
          }

          // Finish the dividing line.

          props.stage = Stage.selectingAfterLine;
          props.snapped = false;
          const indices = this.grid.splitPolygon(
            this.index,
            props.dividingLine
          );

          this.onHover(point, indices[0]);
        } else {
          props.dividingLine.unshift(point);
        }

        break;

      case Stage.selectingAfterLine:
        return this.finish();
    }
  }

  private updateGrid(point: Position): void {
    const props = this.cursorProps;

    if (!props.plants) {
      return;
    }

    if (props.rotationCenter) {
      this.grid.rotation = Math.atan2(
        point[1] - props.rotationCenter[1],
        point[0] - props.rotationCenter[0]
      );
    } else {
      this.grid.setCursor(point);
    }
  }

  private snapToBeds(point: Position): boolean {
    const closest = this.grid.closestPolygon(point, 4 / state.scale);

    if (closest.distance !== undefined) {
      this.cursorProps.dividingLine.splice(0, 1, closest.point.asArray);

      this.cursorProps.snapped = true;
      return true;
    }
    this.cursorProps.snapped = false;

    return false;
  }

  private clearDisplay(): void {
    if (this.planting) {
      this.planting.shape.coordinates = [[[0, 0]]];

      this.cursorProps.plants = null;

      delete this.index;
    }
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
        props.cursor[0] - r * Math.cos(this.grid.rotation),
        props.cursor[1] - r * Math.sin(this.grid.rotation),
      ];

      this.grid.hexGrid.origin.set(...props.rotationCenter);
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

  private finish(): AddPlantingAction | undefined {
    if (this.planting && this.index !== undefined) {
      this.planting.shape.coordinates = [this.grid.areas[this.index].polygon];

      const plants = this.cursorProps.plants;

      if (plants) {
        this.planting.quantity =
          plants.interiorPoints.length +
          plants.edgePoints.reduce((t, p) => t + (p.display ? 1 : 0), 0);
      }

      return new AddPlantingAction(
        Planting.cleanCopy(this.planting),
        plants?.interiorPoints
          .concat(
            plants.edgePoints.filter((e) => e.display).map((e) => e.point)
          )
          .map((p) => [p[0] + plants.offset[0], p[1] + plants.offset[1]])
      );
    }
  }
}

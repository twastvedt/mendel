import { Variety } from "@/entity/Variety";
import { Tool } from "./Tool";
import { AddPlantingAction } from "../actions/AddPlantingAction";
import { Action } from "../actions/Action";
import { ElementType, state } from "../Store";
import drawPlanting from "../components/DrawPlanting.vue";
import { Planting } from "@/entity/Planting";
import { Bed } from "@/entity/Bed";
import { GridPoints } from "../services/polygonGrid";
import { Position } from "@/entity/geoJson";

export class DrawPlantingTool implements Tool {
  public helpText =
    "Click in a bed to fill it with plants. Hold control to rotate plant grid.";

  public Stop(): void {
    removeEventListener("keydown", this.onKeyDown);

    removeEventListener("keyup", this.onKeyUp);

    if (this.planting) {
      state.removePlanting(this.planting);

      delete this.planting;
    }
  }

  private planting?: Planting;

  public constructor(private variety: Variety) {}

  public interactiveElements = new Set<ElementType>(["bed"]);

  public cursorComponent = drawPlanting;
  public cursorProps = {
    cursor: null as Position | null,
    plants: null as GridPoints | null,
    planting: null as Planting | null,
    rotationCenter: null as [number, number] | null,
  };

  private index?: number;

  public OnCursorMove(point: Position): void {
    const props = this.cursorProps;

    props.cursor = point;

    if (props.plants && state.grid) {
      if (props.rotationCenter) {
        state.grid.rotation = Math.atan2(
          point[1] - props.rotationCenter[1],
          point[0] - props.rotationCenter[0]
        );
      } else {
        state.grid.setCursor(point);
      }
    }
  }

  public OnClick(point: Position, bed?: Bed): Action | void {
    if (this.planting && this.index) {
      if (bed) {
        this.planting.shape.coordinates = bed.shape.coordinates;

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
    } else {
      throw new Error("No action to save?");
    }
  }

  public OnHover(point: Position, bed?: Bed, index?: number): void {
    if (this.planting && state.grid) {
      if (this.cursorProps.rotationCenter) {
        this.index = index;
      } else if (bed && index != undefined) {
        this.planting.shape.coordinates = bed.shape.coordinates;
        state.grid.activeGrid = index;

        state.grid.setCursor(point);

        if (this.index !== index) {
          if (!document.hasFocus()) {
            window.focus();
            console.log("window focused");
          }

          this.cursorProps.plants = state.grid.grids[index];

          this.index = index;
        }
      } else {
        // Only clear the planting display if we aren't currently rotating.

        this.clearDisplay();
      }
    }
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
      props.rotationCenter = [
        props.cursor[0] - 50 / state.scale,
        props.cursor[1],
      ];

      state.grid?.hexGrid.origin.set(...props.rotationCenter);
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

  public Start(): void {
    this.planting = new Planting();
    this.planting.variety = this.variety;
    this.planting.varietyId = this.variety.id;
    this.planting.shape = {
      type: "Polygon",
      coordinates: [[[0, 0]]],
    };
    this.planting.gardenId = state.garden?.id;

    if (!this.variety.family || !state.grid) {
      throw new Error("Family and grid required");
    }

    state.grid.diameter = this.variety.family.spacing;

    const props = this.cursorProps;

    props.planting = this.planting;

    if (!document.hasFocus()) {
      window.focus();
      console.log("window focused");
    }

    addEventListener("keydown", this.onKeyDown);
    addEventListener("keyup", this.onKeyUp);
  }
}

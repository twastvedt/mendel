import { Variety } from "@/entity/Variety";
import { Tool } from "./Tool";
import { AddPlantingAction } from "../actions/AddPlantingAction";
import { Action } from "../actions/Action";
import { ElementType, state } from "../Store";
import drawPlanting from "../components/DrawPlanting.vue";
import { Planting } from "@/entity/Planting";
import { Bed } from "@/entity/Bed";
import { polygonArea } from "d3-polygon";
import { GridPoints } from "../services/polygonGrid";
import { Position } from "@/entity/geoJson";

export class DrawPlantingTool implements Tool {
  public Stop(): void {
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
    cursor: [0, 0],
    plants: null as GridPoints | null,
    planting: null as Planting | null,
  };

  private index?: number;

  public OnCursorMove(point: Position): void {
    this.cursorProps.cursor = point;

    if (this.cursorProps.plants && this.index != undefined) {
      state.grid?.setCursor(point, this.index);
    }
  }

  public OnClick(point: Position, bed?: Bed): Action | void {
    if (this.planting) {
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
    if (this.planting) {
      if (bed && index != undefined && state.grid) {
        this.planting.shape.coordinates = bed.shape.coordinates;

        state.grid.setCursor(point, index);

        if (this.index !== index) {
          this.cursorProps.plants = state.grid.grids[index];
          this.index = index;
        }
      } else {
        this.planting.shape.coordinates = [[[0, 0]]];

        this.cursorProps.plants = null;

        delete this.index;
      }
    }
  }

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

    this.cursorProps.planting = this.planting;
  }
}

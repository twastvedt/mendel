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

  public OnCursorMove(x: number, y: number): void {
    this.cursorProps.cursor = [x, y];

    if (this.cursorProps.plants && this.index != undefined) {
      state.grid?.setCursor([x, y], this.index);
    }
  }

  public OnClick(x: number, y: number, bed?: Bed): Action | void {
    if (this.planting) {
      if (bed) {
        this.planting.shape.coordinates = bed.shape.coordinates;

        if (this.variety.family) {
          // A perfect packing would use a factor of 0.907. Polygons may be far from perfect, not sure what the best estimate to use is.
          // TODO: Allow spacing circles to extend past polygon boundary. Or add option to do so.
          this.planting.quantity = Math.round(
            (this.planting.shape.coordinates.reduce(
              (_, p) => polygonArea(p),
              0
            ) *
              0.9) /
              (Math.PI * this.variety.family.spacing ** 2)
          );
        }

        return new AddPlantingAction(Object.assign({}, this.planting));
      }
    } else {
      throw new Error("No action to save?");
    }
  }

  public OnHover(x: number, y: number, bed?: Bed, index?: number): void {
    if (this.planting) {
      if (bed && index != undefined && state.grid) {
        this.planting.shape.coordinates = bed.shape.coordinates;

        state.grid.setCursor([x, y], index);

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

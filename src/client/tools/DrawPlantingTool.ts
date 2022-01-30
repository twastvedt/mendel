import { Variety } from "@/entity/Variety";
import { Tool } from "./Tool";
import { AddPlantingAction } from "../actions/AddPlantingAction";
import { Action } from "../actions/Action";
import Store, { ElementType } from "../Store";
import drawPlanting from "../components/DrawPlanting.vue";
import { Planting } from "@/entity/Planting";
import { Bed } from "@/entity/Bed";
import { polygonArea } from "d3-polygon";

export class DrawPlantingTool implements Tool {
  public Stop(): void {
    if (this.planting) {
      Store.state.removePlanting(this.planting);

      delete this.planting;
    }
  }

  private planting?: Planting;

  public constructor(private variety: Variety) {}

  public interactiveElements = new Set<ElementType>(["bed"]);

  public cursorComponent = drawPlanting;
  public cursorProps: Record<string, unknown> = {
    cursor: [],
  };

  public OnCursorMove(x: number, y: number): void {
    this.cursorProps.cursor = [x, y];
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

  public OnHover(x: number, y: number, bed?: Bed): void {
    if (this.planting) {
      if (bed) {
        this.planting.shape.coordinates = bed.shape.coordinates;
      } else {
        this.planting.shape.coordinates = [[[0, 0]]];
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
    this.planting.gardenId = Store.state.garden?.id;

    this.cursorProps.planting = this.planting;
  }
}

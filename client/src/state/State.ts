import { gardenApi, varietyApi } from "@mendel/common/src";
import type { Position } from "@mendel/common";
import type { Tool } from "../tools/Tool";
import type { Action } from "../actions/Action";
import { geoIdentity, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";
import { GardenState } from "./GardenState";
import axios from "axios";
import type { UiElement } from "../types/entityTypes";

axios.defaults.baseURL = "http://localhost:3000";

const projection = geoIdentity().reflectY(true);

const pathGenerator = geoPath(projection);

export class State {
  // TODO: We assume data is stored in inches relative to garden origin.
  projection = projection;

  pathGenerator = (o: GeoPermissibleObjects) => pathGenerator(o) ?? undefined;

  loading = false;
  scale = 1;

  selection: UiElement[] = [];

  db?: GardenState = undefined;

  actions: Action[] = [];

  toolName = "";
  tool: Tool | null = null;

  cursorPosition = [0, 0] as Position;

  ready: Promise<void>;

  get scaleRange() {
    if (this.scale > 10) {
      return 3;
    } else if (this.scale > 2) {
      return 2;
    } else {
      return 1;
    }
  }

  public constructor() {
    this.ready = this.initialize();

    addEventListener("keyup", (event) => {
      if (event.key === "Escape") {
        if (this.tool) {
          this.clearTool();

          this.toolName = "";
        } else {
          this.selection = [];
        }
      }
    });
  }

  async initialize(): Promise<void> {
    this.loading = true;

    const families = await varietyApi.allByFamily.request();

    const garden = await gardenApi.one.request({ routeParams: { id: 1 } });

    this.db = new GardenState(garden, families);

    this.loading = false;
  }

  onClick(event: MouseEvent, element?: UiElement): void {
    if (this.tool) {
      const action = this.tool.onClick(this.cursorPosition, element);

      if (action) {
        action.Do(this);

        this.actions.push(action);
      }
    } else if (event.ctrlKey || event.shiftKey) {
      if (element) {
        this.selection.push(element);
      }
    } else {
      if (element) {
        this.selection = [element];
      } else {
        this.selection = [];
      }
    }
  }

  setTool(tool: Tool): void {
    this.clearTool();

    tool.start?.();

    this.tool = tool;
  }

  updateTool(cursor: Position) {
    if (this.tool) {
      this.tool.onCursorMove?.(cursor);
    }
  }

  clearTool(): void {
    if (this.tool) {
      this.tool?.stop?.();

      this.tool = null;
    }
  }

  makeTransform(coordinate: Position): string {
    return `translate(${this.projection(coordinate)?.join(" ")})`;
  }

  pathFromPoints(coordinates: Position[]): string | undefined {
    return this.pathGenerator({ type: "LineString", coordinates });
  }
}

export const state = new State();

import type { Position } from "@mendel/common";
import type { Tool } from "../tools/Tool";
import type { Action } from "../actions/Action";
import { geoIdentity, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";
import axios from "axios";
import type { UiElement } from "../types/entityTypes";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

axios.defaults.baseURL = "http://localhost:3000";

export const useRootStore = defineStore("root", () => {
  // TODO: We assume data is stored in inches relative to garden origin.
  const projection = geoIdentity().reflectY(true);

  const projectionGenerator = geoPath(projection);

  function pathGenerator(o: GeoPermissibleObjects) {
    return projectionGenerator(o) ?? undefined;
  }

  const loading = ref(false);
  const scale = ref(1);
  const selection = ref<UiElement[]>([]);
  const actions = ref<Action[]>([]);

  const toolName = ref("");
  const tool = ref<Tool | null>(null);

  const cursorPosition = ref<Position>([0, 0]);

  const scaleRange = computed(() => {
    if (scale.value > 10) {
      return 3;
    } else if (scale.value > 2) {
      return 2;
    } else {
      return 1;
    }
  });

  addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
      if (tool.value) {
        clearTool();

        toolName.value = "";
      } else {
        selection.value = [];
      }
    }
  });

  function onClick(event: MouseEvent, element?: UiElement): void {
    if (tool.value) {
      const action = tool.value.onClick(cursorPosition.value, element);

      if (action) {
        action.Do();

        actions.value.push(action);
      }
    } else if (event.ctrlKey || event.shiftKey) {
      if (element) {
        selection.value.push(element);
      }
    } else {
      if (element) {
        selection.value = [element];
      } else {
        selection.value = [];
      }
    }
  }

  function setTool(newTool: Tool): void {
    clearTool();

    newTool.start?.();

    tool.value = newTool;
  }

  function updateTool(cursor: Position) {
    if (tool.value) {
      tool.value.onCursorMove?.(cursor);
    }
  }

  function clearTool(): void {
    if (tool.value) {
      tool.value?.stop?.();

      tool.value = null;
    }
  }

  function makeTransform(coordinate: Position): string {
    return `translate(${projection(coordinate)?.join(" ")})`;
  }

  function pathFromPoints(coordinates: Position[]): string | undefined {
    return pathGenerator({ type: "LineString", coordinates });
  }

  return {
    projection,
    pathGenerator,
    loading,
    scale,
    selection,
    actions,
    toolName,
    tool,
    cursorPosition,
    scaleRange,
    onClick,
    setTool,
    updateTool,
    clearTool,
    makeTransform,
    pathFromPoints,
  };
});

import type { Position } from "@mendel/common";
import type { Tool } from "../tools/Tool";
import type { Action } from "../actions/Action";
import axios from "axios";
import type { UiElement } from "../types/entityTypes";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

axios.defaults.baseURL =
  import.meta.env.VITE_SERVER_URL ?? "http://localhost:3000";

export const useRootStore = defineStore("root", () => {
  const showDetails = ref(false);
  const loading = ref(false);
  const scale = ref(1);
  const selection = ref<UiElement[]>([]);
  const actions = [] as Action[];

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
        setSelection();
      }
    }
  });

  function setSelection(newSelection?: UiElement[]): void {
    selection.value = newSelection ?? [];

    showDetails.value = !!newSelection?.length;
  }

  function onClick(event: MouseEvent, element?: UiElement): void {
    if (tool.value) {
      const action = tool.value.onClick(cursorPosition.value, element);

      if (action) {
        action.Do();

        actions.push(action);
      }
    } else if (event.ctrlKey || event.shiftKey) {
      if (element) {
        setSelection([...selection.value, element]);
      }
    } else {
      if (element) {
        setSelection([element]);
      } else {
        setSelection();
      }
    }

    event.stopImmediatePropagation();
  }

  function setTool(newTool: Tool): void {
    clearTool();

    newTool.start?.();

    tool.value = newTool;
  }

  function updateTool(cursor: Position) {
    tool.value?.onCursorMove?.(cursor);
  }

  function clearTool(): void {
    if (tool.value) {
      tool.value.stop?.();

      tool.value = null;
    }
  }

  return {
    loading,
    scale,
    selection,
    toolName,
    tool,
    cursorPosition,
    scaleRange,
    showDetails,
    onClick,
    setTool,
    updateTool,
    clearTool,
  };
});

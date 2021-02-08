/* eslint-disable @typescript-eslint/no-namespace */

// Many types are missing from those shipped with leaflet-geoman. Added here.

import * as L from "leaflet";

declare module "leaflet" {
  interface Layer {
    _pmTempLayer: boolean;
  }

  interface Marker {
    _snapped: boolean;
  }

  namespace PM {
    export interface MapDrawOptions {
      markerStyle?: L.MarkerOptions;
      continueDrawing?: boolean;
    }

    export class Draw extends L.Class {
      constructor(map: L.Map);

      initialize(map: L.Map): void;
      disable(): void;

      options: MapDrawOptions;
      _map: L.Map;
      _setGlobalDrawMode: () => void;
      _addDrawnLayerProp: (marker: L.Marker) => void;
      _setShapeForFinishLayer: (layer: L.Layer) => void;

      _cleanupSnapping(): void;
      _handleSnapping(e: L.LeafletMouseEvent): void;

      static Marker: typeof Marker;
    }

    class Marker extends Draw {
      enable(options: MapDrawOptions): void;
      enabled(): boolean;
      toggle(options: MapDrawOptions): void;
      isRelevantMarker(layer: L.Layer): boolean;
      _syncHintMarker(e: LeafletMouseEvent): void;
      _createMarker(e: LeafletMouseEvent): void;
    }

    export class PMButton extends L.Control {
      initialize(options: L.ControlOptions): void;

      onAdd(map: L.Map): HTMLElement;

      onRemove(): HTMLElement;

      getText(): string;

      getIconUrl(): string;

      destroy(): void;

      toggle(e?: boolean): boolean;

      toggled(): boolean;

      onCreate(): void;
    }

    export class Toolbar {
      options: {
        drawMarker: boolean;
        drawRectangle: boolean;
        drawPolyline: boolean;
        drawPolygon: boolean;
        drawCircle: boolean;
        drawCircleMarker: boolean;
        editMode: boolean;
        dragMode: boolean;
        cutPolygon: boolean;
        removalMode: boolean;
        snappingOption: boolean;
        drawControls: boolean;
        editControls: boolean;
        optionsControls: boolean;
        customControls: boolean;
        oneBlock: boolean;
        position: string;
        positions: {
          draw: string;
          edit: string;
          options: string;
          custom: string;
        };
      };

      customButtons: [];

      map: L.Map;

      buttons: PMButton[];

      initialize(map: L.Map): void;

      reinit(): void;

      init(map: L.Map): void;

      _createContainer(name: string): HTMLElement;

      getButtons(): PMButton[];

      addControls(options: typeof Toolbar.prototype.options): void;

      applyIconStyle(): void;

      removeControls(): void;

      toggleControls(options: typeof Toolbar.prototype.options): void;

      _addButton(name: string, button: PMButton): PMButton;

      triggerClickOnToggledButtons(exceptThisButton: PMButton): void;

      toggleButton(
        name: string,
        status: boolean,
        disableOthers?: boolean
      ): boolean;

      _defineButtons(): void;

      _showHideButtons(): void;

      _getBtnPosition(block: string): string;

      setBlockPosition(block: string, position: string): void;

      getBlockPositions(): typeof Toolbar.prototype.options.positions;

      copyDrawControl(copyInstance: string, options: unknown): unknown;

      createCustomControl(options: unknown): PMButton;

      changeControlOrder(order: string[]): void;

      getControlOrder(): PMButton[];

      changeActionsOfControl(name: string, actions: unknown): void;
    }

    interface Map {
      _getContainingLayer(): L.Map | L.LayerGroup<unknown>;
      Toolbar: L.PM.Toolbar;
    }
  }
}

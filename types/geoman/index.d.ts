// TODO: Use types shipped with Geoman once this is merged: https://github.com/geoman-io/leaflet-geoman/pull/678.

import * as L from "leaflet";

declare module "leaflet" {
  export interface GeomanLayerOptions {
    pmIgnore?: boolean;
  }

  interface Layer {
    _pmTempLayer: boolean;
  }

  interface Marker {
    _snapped: boolean;
  }

  namespace PM {
    export type SUPPORTED_SHAPES =
      | "Marker"
      | "Circle"
      | "Line"
      | "Rectangle"
      | "Polygon"
      | "Cut";

    export type GEOMAN_MAP_DRAW_MODE_EVENTS =
      | "pm:drawstart"
      | "pm:drawend"
      | "pm:create";

    export type GEOMAN_MAP_EDIT_MODE_EVENTS = "pm:globaleditmodetoggled";

    export type GEOMAN_MAP_DRAG_MODE_EVENTS = "pm:globaldrawmodetoggled";

    export type GEOMAN_MAP_REMOVAL_MODE_EVENTS = "pm:globalremovalmodetoggled";

    export type GEOMAN_MAP_CUT_MODE_EVENTS = "pm:cut";

    export type GEOMAN_LAYER_DRAW_MODE_EVENTS =
      | "pm:vertexadded"
      | "pm:snapdrag"
      | "pm:snap"
      | "pm:unsnap"
      | "pm:centerplaced";

    export type GEOMAN_LAYER_EDIT_MODE_EVENTS =
      | "pm:edit"
      | "pm:vertexadded"
      | "pm:vertexremoved"
      | "pm:markerdragstart"
      | "pm:markerdragend"
      | "pm:snap"
      | "pm:unsnap"
      | "pm:intersect"
      | "pm:centerplaced";

    export type GEOMAN_LAYER_DRAG_MODE_EVENTS =
      | "pm:dragstart"
      | "pm:drag"
      | "pm:dragend";

    export type GEOMAN_LAYER_CUT_MODE_EVENTS = "pm:cut";

    export interface GeomanHelpers {
      getShapes(): string[];
    }

    export class MapDrawOptions {
      snappable?: boolean;
      snapDistance?: number;
      snapMiddle?: boolean;
      tooltips?: boolean;
      allowSelfIntersection?: true;
      templineStyle?: L.PathOptions;
      hintlineStyle?: L.PathOptions;
      cursorMarker?: boolean;
      finishOn?:
        | null
        | "click"
        | "dblclick"
        | "mousedown"
        | "mouseover"
        | "mouseout"
        | "contextmenu";
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
      toggle(options): void;
      isRelevantMarker(layer): boolean;
      _syncHintMarker(e: LeafletMouseEvent): void;
      _createMarker(e: LeafletMouseEvent): void;
    }

    export class LayerDrawOptions {
      snappable?: boolean;
      snapDistance?: number;
      allowSelfIntersection?: boolean;
      preventMarkerRemoval?: boolean;
    }

    export class DrawControlOptions {
      position?: ControlPosition;
      drawMarker?: boolean;
      drawCircleMarker?: boolean;
      drawPolyline?: boolean;
      drawRectangle?: boolean;
      drawPolygon?: boolean;
      drawCircle?: boolean;
      editMode?: boolean;
      dragMode?: boolean;
      cutPolygon?: boolean;
      removalMode?: boolean;
    }

    export function initialize(options?: { optIn: boolean }): void;

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

      buttons: L.Control.PMButton[];

      initialize(map: L.Map): void;

      reinit(): void;

      init(map: L.Map): void;

      _createContainer(name: string): HTMLElement;

      getButtons(): L.Control.PMButton[];

      addControls(options: typeof this.options): void;

      applyIconStyle(): void;

      removeControls(): void;

      toggleControls(options: typeof this.options): void;

      _addButton(name: string, button: L.Control.PMButton): L.Control.PMButton;

      triggerClickOnToggledButtons(exceptThisButton: L.Control.PMButton): void;

      toggleButton(
        name: string,
        status: boolean,
        disableOthers: boolean = true
      ): boolean;

      _defineButtons(): void;

      _showHideButtons(): void;

      _getBtnPosition(block: string): string;

      setBlockPosition(block: string, position: string): void;

      getBlockPositions(): typeof this.options.positions;

      copyDrawControl(copyInstance: string, options: unknown): unknown;

      createCustomControl(options: unknown): L.Control.PMButton;

      changeControlOrder(order: string[]): void;

      getControlOrder(): L.Control.PMButton[];

      changeActionsOfControl(name: string, actions: unknown): void;
    }

    export class Translations {
      tooltips?: {
        placeMarker?: string;
        firstVertex?: string;
        continueLine?: string;
        finishLine?: string;
        finishPoly?: string;
        finishRect?: string;
        startCircle?: string;
        finishCircle?: string;
        placeCircleMarker?: string;
      };

      actions?: {
        finish?: string;
        cancel?: string;
        removeLastVertex?: string;
      };

      buttonTitles?: {
        drawMarkerButton?: string;
        drawPolyButton?: string;
        drawLineButton?: string;
        drawCircleButton?: string;
        drawRectButton?: string;
        editButton?: string;
        dragButton?: string;
        cutButton?: string;
        deleteButton?: string;
        drawCircleMarkerButton?: string;
      };
    }

    interface Map {
      addControls(options?: DrawControlOptions): void;
      enableDraw(shape: SUPPORTED_SHAPES, options?: MapDrawOptions): void;
      disableDraw(shape?: SUPPORTED_SHAPES): void;
      enableGlobalEditMode(options): void;
      disableGlobalEditMode(): void;
      toggleGlobalEditMode(options): void;
      globalEditEnabled(): boolean;
      setLang(
        lang:
          | "en"
          | "de"
          | "it"
          | "ru"
          | "ro"
          | "es"
          | "fr"
          | "pt_br"
          | "zh"
          | "nl",
        customTranslations?: Translations,
        fallbackLanguage?: string
      );
      setPathOptions(options: PathOptions): void;
      _getContainingLayer(): L.Map | L.LayerGroup<unknown>;
      Draw: GeomanHelpers;
      Toolbar: L.PM.Toolbar;
    }

    interface Layer {
      enable(options?: LayerDrawOptions): void;
      disable(): void;
      toggleEdit(options?: LayerDrawOptions): void;
      enabled(): boolean;
      hasSelfIntersection(): boolean;
    }
  }

  interface Map {
    pm: PM.Map;
  }

  interface Layer {
    pm: PM.Layer;
  }

  interface LayerOptions {
    pmIgnore?: boolean;
  }

  interface MapOptions {
    pmIgnore?: boolean;
  }
}

import { Color } from "../../others/Color";
import Point from "../../others/Point";
import { Plugin } from "./Plugin";

export type BaseEventType =
  | "onMouseDown"
  | "onMouseMove"
  | "onMouseUp"
  | "onMouseLeave"
  | "onMouseEnter"
  | "onMouseWheel"
  | "onClick"
  | "onKeyDown"
  | "onKeyUp"
  | "onKeyPress"
  | "onMouseDragStart"
  | "onMouseDrag"
  | "onMouseDragEnd"
  | "onSelectedShapeChange"
  | "onSelectedToolChange"
  | "onPreDraw"
  | "onDraw"
  | "onPostDraw"
  | "onActive"
  | "onDeActive"
  | "onInitProperty";

abstract class BaseEvent {
  protected onMouseDown(e: EditorMouseEvent) {}
  protected onMouseMove(e: EditorMouseEvent) {}
  protected onMouseUp(e: EditorMouseEvent) {}
  protected onMouseLeave(e: EditorMouseEvent) {}
  protected onMouseEnter(e: EditorMouseEvent) {}
  protected onMouseWheel(e: EditorWheelEvent) {}
  //keyEvent
  protected onKeyDown(e: EditorKeyEvent) {}
  protected onKeyUp(e: EditorKeyEvent) {}
  protected onKeyPress(e: EditorKeyEvent) {}
  //mouse drag event
  protected onMouseDragStart(e: EditorMouseEvent) {}
  protected onMouseDrag(e: EditorMouseEvent) {}
  protected onMouseDragEnd(e: EditorMouseEvent) {}

  //callback
  // protected onSelectedShapeChange(shape?: Shape) {}
  // protected onSelectedToolChange(tool?: Tool) {}
  // protected onInitProperty(shape: Shape) {}
  protected onMessage(type: BaseEventType, ...args: any) {}
  sendMessage(type: BaseEventType, ...args: any) {
    this.onMessage(type, args);
  }
}
export interface EditorMouseEvent {
  x: number;
  y: number;
  sp:Point;
  wp:Point;
  pe: PointerEvent;
}
export interface EditorWheelEvent {
  x: number;
  y: number;
  we: WheelEvent;
  direction: "up" | "down";
}

export interface EditorKeyEvent {
  ke: KeyboardEvent;
}

export interface EditorProperties {
  documentWidth: number;
  documentHeight: number;
  backgroundColor: Color;
  zoom: number;
  maxZoom: number;
  minZoom: number;
  grid: boolean;
  gridColor: Color;
  isDragging: boolean;
  panOffset: Point;
}

export type PluginInfo = { pluginType: typeof Plugin; name: string,order?:number };

export type MessageHookCallback = (type: PluginEventType, ...args: any[]) => void;
export type PluginEventType = BaseEventType | "onActivate" | "onDeActivate";

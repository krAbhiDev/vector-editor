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
  | "onInitProperty"

abstract class BaseEvent {
  protected onMouseDown(e: PointerEvent) {}
  protected onMouseMove(e: PointerEvent) {}
  protected onMouseUp(e: PointerEvent) {}
  protected onMouseLeave(e: PointerEvent) {}
  protected onMouseEnter(e: PointerEvent) {}
  protected onMouseWheel(e: WheelEvent) {}
  protected onClick(e: MouseEvent) {}
  //keyEvent
  protected onKeyDown(e: KeyboardEvent) {}
  protected onKeyUp(e: KeyboardEvent) {}
  protected onKeyPress(e: KeyboardEvent) {}
  //mouse drag event
  protected onMouseDragStart(e: PointerEvent) {}
  protected onMouseDrag(e: PointerEvent) {}
  protected onMouseDragEnd(e: PointerEvent) {}

  //callback
  // protected onSelectedShapeChange(shape?: Shape) {}
  // protected onSelectedToolChange(tool?: Tool) {}
  // protected onInitProperty(shape: Shape) {}
  protected onMessage(type: BaseEventType, ...args: any) {}
  sendMessage(type: BaseEventType, ...args: any) {
    this.onMessage(type, args);
  }
}

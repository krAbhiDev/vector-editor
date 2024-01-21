import Point from "../../others/Point";
import { Render } from "../../others/Render";
import { CircleShape, Shape } from "./Shape";
import { Tool } from "./Tool";
import VectorEditor from "./VectorEditor";
import {
  BaseEventType,
  EditorKeyEvent,
  EditorMouseEvent,
  EditorProperties,
  EditorWheelEvent,
  MessageHookCallback,
  PluginEventType,
} from "./common";

type MessageHook = {
  type?: "before" | "after";
  callback: MessageHookCallback;
};
export class Plugin {
  name: string = "Plugin";
  private _key: string = "";
  // private messageHooks: MessageHookCallback[] = [];
  private messageHooks: MessageHook[] = [];

  get key() {
    return this._key;
  }
  private _editor?: VectorEditor;
  get editor() {
    if (!this._editor) throw new Error("Editor is not activated");
    return this._editor;
  }
  get shapes() {
    return this.editor.shapes;
  }

  sendMessage(type: PluginEventType, ...args: any) {
    for (const hook of this.messageHooks) {
      if (hook.type == "before" || !hook.type) {
        hook.callback(type, ...args);
      }
    }
    this.onMessage(type, ...args);
    for (const hook of this.messageHooks) {
      if (hook.type == "after") {
        hook.callback(type, ...args);
      }
    }
  }

  redraw() {
    this.editor.redraw();
  }
  capturePointer(e: EditorMouseEvent) {
    this.editor.capturePointer(e);
  }
  releasePointer(e: EditorMouseEvent) {
    this.editor.releasePointer(e);
  }
  get properties(): EditorProperties {
    return this.editor.properties;
  }
  set properties(properties: Partial<EditorProperties>) {
    this.editor.properties = properties;
  }

  //callbacks
  protected onMessage(type: PluginEventType, ...args: any) {
    switch (type) {
      case "onActivate":
        this._editor = args[0];
        this.onActivate();
        console.log(this.name,type);
        break;
      case "onDeActivate":
        this.onDeActivate();
        break;
      case "onDraw":
        this.onDraw(args[0]);
        break;
      case "onPreDraw":
        this.onPreDraw(args[0]);
        break;
      case "onPostDraw":
        // console.log(type, this.name);
        this.onPostDraw(args[0]);
        break;
      case "onSelectedShapeChange":
        this.onSelectedShapeChange(args[0]);
        break;
      case "onSelectedToolChange":
        this.onSelectedToolChange(args[0]);
        break;

      case "onMouseDown":
        this.onMouseDown(args[0]);
        break;
      case "onMouseMove":
        this.onMouseMove(args[0]);
        break;
      case "onMouseUp":
        this.onMouseUp(args[0]);
        break;
      case "onMouseLeave":
        this.onMouseLeave(args[0]);
        break;
      case "onMouseEnter":
        this.onMouseEnter(args[0]);
        break;
      case "onMouseWheel":
        this.onMouseWheel(args[0]);
        break;
      case "onKeyDown":
        this._key = (args[0] as EditorKeyEvent).ke.key;
        this.onKeyDown(args[0]);
        break;
      case "onKeyUp":
        this._key = "";
        this.onKeyUp(args[0]);
        break;
      case "onKeyPress":
        this.onKeyPress(args[0]);
        break;
      case "onMouseDragStart":
        this.onMouseDragStart(args[0]);
        break;
      case "onMouseDrag":
        this.onMouseDrag(args[0]);
        break;
      case "onMouseDragEnd":
        this.onMouseDragEnd(args[0]);
        break;
    }
  }

  protected onActivate() {}
  protected onDeActivate() {}

  //draw
  protected onPreDraw(render: Render) {}
  protected onDraw(render: Render) {}
  protected onPostDraw(render: Render) {}

  //shape & tools
  protected onSelectedShapeChange(shape?: Shape) {}
  protected onSelectedToolChange(tool?: Tool) {}

  //mouse event
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

  //utils
  protected findShapeAtPoint(wPoint: Point): Shape | undefined {
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      const shape = this.shapes[i];
      if (shape.isPointInside(wPoint.x, wPoint.y)) {
        //shape is
        return shape;
      }
    }
    return undefined;
  }

  // messageHooks
  addMessageHook(callback: MessageHookCallback, type?: "before" | "after") {
    const hook: MessageHook = { callback, type };
    this.messageHooks.push(hook);
    return hook;
  }

  removeMessageHook(hook: MessageHook): void {
    const index = this.messageHooks.indexOf(hook);
    if (index !== -1) {
      this.messageHooks.splice(index, 1);
    }
  }
  get isHandling(): boolean {
    return false;
  }
}

export class ToolPlugin extends Plugin {
  protected hoverShape?: Shape;
  protected _tool?: Tool;
  get tool() {
    if (!this._tool) throw new Error("Tool is null");
    return this._tool;
  }
  protected registerTool(tool: Tool) {
    this._tool = tool;
    this.editor.addTool(tool);
  }
  protected onDeActivate(): void {
    if (this._tool) this.editor.removeTool(this._tool);
    this._tool = undefined;
  }

  sendMessage(type: PluginEventType, ...args: any): void {
    if (type == "onActivate" || type == "onDeActivate") {
      super.sendMessage(type, ...args);
      return;
    }
    if (this.editor.selectedTool && this.editor.selectedTool == this.tool)
      super.sendMessage(type, ...args);
    // else
    //   console.warn(
    //     `Plugin ${this.name} is not selected tool, so it cannot send message`
    //   );
  }
  //shape callback
  protected onHoverShapeChange(shape?: Shape) {}

  protected onMessage(type: PluginEventType, ...args: any): void {
    if (type == "onMouseMove") {
      let hoverShape = this.findShapeAtPoint(args[0].wp);
      if (hoverShape != this.hoverShape) {
        this.hoverShape = hoverShape;
        this.onHoverShapeChange(hoverShape);
      }
    }
    super.onMessage(type, ...args);
  }
}

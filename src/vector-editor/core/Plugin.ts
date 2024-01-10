import Point from "../../others/Point";
import { Render } from "../../others/Render";
import { Circle, Shape } from "./Shape";
import { Tool } from "./Tool";
import VectorEditor from "./VectorEditor";
import { BaseEventType } from "./common";
export type PluginEventType = BaseEventType | "onActivate" | "onDeActivate";

export class Plugin {
  private _editor?: VectorEditor;
  get editor() {
    if (!this._editor) throw new Error("Editor is not activated");
    return this._editor;
  }

  protected onActivate(editor: VectorEditor) {}
  protected onDeActivate() {}
  protected onMessage(type: PluginEventType, ...args: any) {
    switch (type) {
      case "onActivate":
        console.log(type, args);
        this._editor = args[0];
        this.onActivate(args[0]);
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
        this.onPostDraw(args[0]);
        break;
      case "onSelectedShapeChange":
        this.onSelectedShapeChange(args[0]);
        break;
      case "onSelectedToolChange":
        this.onSelectedToolChange(args[0]);
        break;
    }
  }

  sendMessage(type: PluginEventType, ...args: any) {
    this.onMessage(type, ...args);
  }

  //draw
  protected onPreDraw(render: Render) {}
  protected onDraw(render: Render) {}
  protected onPostDraw(render: Render) {}
  redraw() {
    this.editor.redraw();
  }

  //shape & tools
  protected onSelectedShapeChange(shape?: Shape) {}
  protected onSelectedToolChange(tool?: Tool) {}
}

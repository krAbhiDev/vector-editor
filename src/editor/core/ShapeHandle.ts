import { Color } from "../../others/Color";
import Point from "../../others/Point";
import { Rect } from "../../others/Rect";
import { Render } from "../../others/Render";
import { ToolPlugin } from "./Plugin";
import { Shape } from "./Shape";
import { EditorMouseEvent } from "./common";
export type ShapeHandleLogicCallback = (
  e: EditorMouseEvent,
  shape: Shape
) => void;
type ValidateCallback = (e?: Shape) => boolean;
export class ShapeHandle {
  private rect = new Rect();
  private color = Color.fromHex("#000000");
  isMouseInside = false;
  isHandling = false;
  private size = 10;
  constructor(
    public plugin: ToolPlugin,
    public anchor: Point = new Point(0, 0),
    public logicCallback: ShapeHandleLogicCallback,
    public validateCallback: ValidateCallback
  ) {
    plugin.addMessageHook((type, ...args) => {
      if (!this.isValid()) return;
      switch (type) {
        case "onMouseDown": {
          const e = args[0] as EditorMouseEvent;
          if (this.isMouseInside && !plugin.isHandling && e.pe.buttons == 1) {
            this.isHandling = true;
            this.plugin.redraw();
          }
          break;
        }
        case "onMouseUp":
          this.isHandling = false;
          this.plugin.redraw();
          break;
        case "onMouseMove": {
          const e = args[0] as EditorMouseEvent;
          //if mouse if over handle, change color
          let isMouseInside = this.rect.isPointInside(e.wp.x, e.wp.y);
          if (isMouseInside != this.isMouseInside) {
            this.isMouseInside = isMouseInside;
            //toggle color
            this.color = isMouseInside
              ? Color.fromHex("#ff0000")
              : Color.fromHex("#000000");
            this.plugin.redraw();
          }
          if (this.plugin.selectedShape && this.isHandling) {
            this.logicCallback(e, this.plugin.selectedShape);
            // this.resize(e);
            this.update();
            plugin.redraw();
          }
          break;
        }
        case "onSelectedToolChange":
        case "onSelectedShapeChange":
          this.update();
          break;
      }
    });
    plugin.addMessageHook((type, ...args) => {
      switch (type) {
        case "onPostDraw": {
          if (plugin.editor.selectedShape) {
            const render = args[0] as Render;
            this.draw(render);
          }
          break;
        }
      }
    }, "after");
  }
  private isValid() {
    return this.validateCallback(this.plugin.selectedShape);
  }
  update() {
    if (!this.isValid()) return;
    //for all plugin handle
    for (const handle of this.plugin.handles) {
      handle.updateRect();
    }
  }
  updateRect() {
    if (this.plugin.editor.selectedShape) {
      const bound = this.plugin.editor.selectedShape.getBound();
      const x = this.anchor.x * bound.width + bound.x;
      const y = this.anchor.y * bound.height + bound.y;
      this.rect = Rect.fromCenter(new Point(x, y), this.size, this.size);
    }
  }
  draw(render: Render) {
    if (!this.isValid()) return;
    if (this.plugin.selectedShape) {
      render.drawRect2(this.rect, {
        mode: "fill",
        fillColor: this.color.toString(),
      });
    }
  }
}

import { Color } from "../../others/Color";
import Point from "../../others/Point";
import { Rect } from "../../others/Rect";
import { Render } from "../../others/Render";
import { Plugin } from "./Plugin";
import { Shape } from "./Shape";
import { EditorMouseEvent } from "./common";
export type ShapeHandleLogicCallback = (
  e: EditorMouseEvent,
  shape: Shape
) => void;
export class ShapeHandle {
  private rect = new Rect();
  private color = Color.fromHex("#000000");
  isMouseInside = false;
  isHandling = false;
  private size = 10;
  constructor(
    public plugin: Plugin,
    public anchor: Point = new Point(0, 0),
    public logicCallback?: ShapeHandleLogicCallback
  ) {
    plugin.addMessageHook((type, ...args) => {
      switch (type) {
        case "onMouseDown": {
          const e = args[0] as EditorMouseEvent;
          if (this.isMouseInside && !plugin.isHandling && e.pe.buttons == 1) {
            this.isHandling = true;
            this.plugin.redraw();
          }
          console.log(e.pe.buttons, "buttons", this.isHandling);
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
          if (this.plugin.editor.selectedShape && this.isHandling) {
            logicCallback?.(e, this.plugin.editor.selectedShape);
            // this.resize(e);
            this.updateRect();
            plugin.redraw();
          }
          break;
        }
        case "onSelectedToolChange":
        case "onSelectedShapeChange":
          this.updateRect();
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
  private updateRect() {
    if (this.plugin.editor.selectedShape) {
      const bound = this.plugin.editor.selectedShape.getBounds();
      const x = this.anchor.x * bound.width + bound.x;
      const y = this.anchor.y * bound.height + bound.y;
      this.rect = Rect.fromCenter(new Point(x, y), this.size, this.size);
    }
  }
  draw(render: Render) {
    if (this.plugin.editor.selectedShape) {
      render.drawRect2(this.rect, {
        mode: "fill",
        fillColor: this.color.toString(),
      });
    }
  }
}

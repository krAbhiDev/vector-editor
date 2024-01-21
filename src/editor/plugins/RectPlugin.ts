import { Color } from "../../others/Color";
import Point from "../../others/Point";
import { Render } from "../../others/Render";
import { ToolPlugin } from "../core/Plugin";
import { RectShape, Shape } from "../core/Shape";
import { Tool } from "../core/Tool";
import { EditorMouseEvent } from "../core/common";
import { ShapeHandle } from "../core/ShapeHandle";
export class RectPlugin extends ToolPlugin {
  wdp = new Point();
  wOffset = new Point();
  color = Color.random(150);
  isDrawing = false;
  handles: ShapeHandle[] = [];

  get isHandling(): boolean {
    //loop all handle
    for (const handle of this.handles) {
      if (handle.isHandling) return true;
    }
    return false;
  }
  protected drawHandles(render: Render) {
    for (const handle of this.handles) {
      handle.draw(render);
    }
  }

  protected onActivate(): void {
    //create tool
    const tool = new Tool({ name: "Rect" });
    this.registerTool(tool);

    //handles
    this.handles = [
      //left top
      new ShapeHandle(this, new Point(0, 0), (e, shape) => {
        if (shape instanceof RectShape) {
          if (e.wp.x < shape.rect.right) shape.rect.left = e.wp.x;
          else shape.rect.left = shape.rect.right;
          if (e.wp.y < shape.rect.bottom) shape.rect.top = e.wp.y;
          else shape.rect.top = shape.rect.bottom;
        }
      }),
      //bottom right
      new ShapeHandle(this, new Point(1, 1), (e, shape) => {
        if (shape instanceof RectShape) {
          if (e.wp.x > shape.rect.left) shape.rect.right = e.wp.x;
          else shape.rect.right = shape.rect.left;
          if (e.wp.y > shape.rect.top) shape.rect.bottom = e.wp.y;
          else shape.rect.bottom = shape.rect.top;
        }
      }),
    ];
  }
  protected onDeActivate(): void {
    super.onDeActivate();
  }

  protected onMouseMove(e: EditorMouseEvent): void {}
  protected onMouseDown(e: EditorMouseEvent): void {
    this.wdp = e.wp.clone();
  }
  protected onMouseUp(e: EditorMouseEvent): void {
    if (!this.isHandling && e.button == 1) {
      let selectedShape = this.findShapeAtPoint(e.wp);
      if (selectedShape != this.editor.selectedShape) {
        this.editor.selectedShape = selectedShape;
        this.redraw();
      }
    }
  }
  protected onMouseDragStart(e: EditorMouseEvent): void {
    if (!this.isHandling && e.pe.buttons == 1) {
      this.isDrawing = true;
      this.color = Color.random(150);
    }
  }
  protected onMouseDrag(e: EditorMouseEvent): void {
    this.wOffset = e.wp.clone().sub(this.wdp);
    if (this.isDrawing) this.redraw();
  }
  protected onMouseDragEnd(e: EditorMouseEvent): void {
    if (this.isDrawing) {
      this.isDrawing = false;
      //add RectShape to editor
      const rect = new RectShape();
      rect.x = this.wOffset.x < 0 ? this.wdp.x + this.wOffset.x : this.wdp.x;
      rect.y = this.wOffset.y < 0 ? this.wdp.y + this.wOffset.y : this.wdp.y;
      rect.width = Math.abs(this.wOffset.x);
      rect.height = Math.abs(this.wOffset.y);
      rect.color = this.color.toString();
      this.editor.addShape(rect);
      this.editor.selectedShape = rect;
      this.redraw();
    }
  }
  protected onPostDraw(render: Render): void {
    if (this.isDrawing)
      render.drawRect(this.wdp, this.wOffset.x, this.wOffset.y, {
        mode: "fill",
        fillColor: this.color.toString(),
      });
    if (this.editor.selectedShape) {
      //draw highlight
      const bound = this.editor.selectedShape.getBounds();
      render.drawRect(new Point(bound.x, bound.y), bound.width, bound.height, {
        mode: "stroke",
        strokeColor: "#000000",
        lineDash: [3, 5],
      });
    }
  }
  protected onSelectedShapeChange(shape?: Shape | undefined): void {
    console.log(this.editor.shapes);
    if (shape instanceof RectShape) {
      this.onRectShapeSelected(shape);
    }
    this.redraw();
  }
  protected onRectShapeSelected(shape: RectShape): void {}
  protected onHoverShapeChange(shape?: Shape | undefined): void {
    this.redraw();
  }
  protected onSelectedToolChange(tool?: Tool | undefined): void {
    if (tool == this.tool) {
      this.redraw();
    }
  }
}

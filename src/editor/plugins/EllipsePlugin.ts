import { Color } from "../../others/Color";
import Point from "../../others/Point";
import { Render } from "../../others/Render";
import { ToolPlugin } from "../core/Plugin";
import { EllipseShape, RectShape, Shape } from "../core/Shape";
import { Tool } from "../core/Tool";
import { EditorMouseEvent } from "../core/common";
import { ShapeHandle } from "../core/ShapeHandle";
import { Rect } from "../../others/Rect";
export class EllipsePlugin extends ToolPlugin {
  selectedShapeOffset = new Point();
  wdp = new Point();
  wOffset = new Point();
  color = Color.random(150);
  isDrawing = false;

  protected onActivate(): void {
    //create tool
    const tool = new Tool({ name: "Ellipse" });
    this.registerTool(tool);

    //handles
    this.handles = [
      //left top
      new ShapeHandle(
        this,
        new Point(0, 0),
        (e, shape) => {
          if (shape instanceof EllipseShape) {
            if (e.wp.x < shape.right) shape.left = e.wp.x;
            else shape.left = shape.right;
            if (e.wp.y < shape.bottom) shape.top = e.wp.y;
            else shape.top = shape.bottom;
          }
        },
        (e) => {
          return e instanceof EllipseShape;
        }
      ),
      //bottom right
      new ShapeHandle(
        this,
        new Point(1, 1),
        (e, shape) => {
          if (shape instanceof EllipseShape) {
            if (e.wp.x > shape.left) shape.right = e.wp.x;
            else shape.right = shape.left;
            if (e.wp.y > shape.top) shape.bottom = e.wp.y;
            else shape.bottom = shape.top;
          }
        },
        (e) => {
          return e instanceof EllipseShape;
        }
      ),
      //move from center
      new ShapeHandle(
        this,
        new Point(0.5, 0.5),
        (e, shape) => {
          if (shape instanceof EllipseShape) {
            shape.x = e.wp.x - this.selectedShapeOffset.x;
            shape.y = e.wp.y - this.selectedShapeOffset.y;
          }
        },
        (e) => {
          return e instanceof EllipseShape;
        }
      ),
    ];
  }
  protected onDeActivate(): void {
    super.onDeActivate();
  }

  protected onMouseMove(e: EditorMouseEvent): void {}
  protected onMouseDown(e: EditorMouseEvent): void {
    this.wdp = e.wp.clone();
    let selectedShape = this.editor.selectedShape;
    if (selectedShape) {
      this.selectedShapeOffset = e.wp
        .clone()
        .sub(new Point(selectedShape.x, selectedShape.y));
    }
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
      const rect = new Rect();
      rect.x = this.wOffset.x < 0 ? this.wdp.x + this.wOffset.x : this.wdp.x;
      rect.y = this.wOffset.y < 0 ? this.wdp.y + this.wOffset.y : this.wdp.y;
      rect.width = Math.abs(this.wOffset.x);
      rect.height = Math.abs(this.wOffset.y);

      const ellipse = new EllipseShape();
      ellipse.x = rect.center.x;
      ellipse.y = rect.center.y;
      ellipse.radiusX = rect.width / 2;
      ellipse.radiusY = rect.height / 2;
      ellipse.color = this.color.toString();
      this.editor.addShape(ellipse);
      this.editor.selectedShape = ellipse;
      this.redraw();
    }
  }
  protected onPostDraw(render: Render): void {
    if (this.isDrawing) {
      const rect = new Rect();
      rect.x = this.wOffset.x < 0 ? this.wdp.x + this.wOffset.x : this.wdp.x;
      rect.y = this.wOffset.y < 0 ? this.wdp.y + this.wOffset.y : this.wdp.y;
      rect.width = Math.abs(this.wOffset.x);
      rect.height = Math.abs(this.wOffset.y);
      render.drawEllipse(rect.center, rect.width * 0.5, rect.height * 0.5, {
        mode: "fill",
        fillColor: this.color.toString(),
      });
    }

    if (this.editor.selectedShape) {
      //draw highlight
      const bound = this.editor.selectedShape.getBound();
      render.drawRect(new Point(bound.x, bound.y), bound.width, bound.height, {
        mode: "stroke",
        strokeColor: "#000000",
        lineDash: [3, 5],
      });
    }
  }
  protected onSelectedShapeChange(shape?: Shape | undefined): void {
    this.redraw();
  }

  protected onSelectedToolChange(tool?: Tool | undefined): void {
    if (tool == this.tool) {
      this.redraw();
    }
  }
}

import Point from "../../others/Point";
import { Render } from "../../others/Render";
import { ToolPlugin } from "../core/Plugin";
import { RectShape, Shape } from "../core/Shape";
import { Tool } from "../core/Tool";
import VectorEditor from "../core/VectorEditor";
import { EditorMouseEvent } from "../core/common";

export class SelectAndTransformPlugin extends ToolPlugin {
  protected selectedShapeOffset = new Point();
  protected isUpdatingSelectedShape = false;
  protected onActivate(): void {
    //create tool
    const tool = new Tool({ name: "Select" });
    this.registerTool(tool);
  }
  protected onDeActivate(): void {
    super.onDeActivate();
  }
  protected onMouseDown(e: EditorMouseEvent): void {
    let selectedShape = this.findShapeAtPoint(e.wp);
    if (selectedShape) {
      this.selectedShapeOffset = e.wp
        .clone()
        .sub(new Point(selectedShape.x, selectedShape.y));
    }
    if (selectedShape != this.editor.selectedShape) {
      this.editor.selectedShape = selectedShape;

      this.redraw();
    }
  }
  protected onHoverShapeChange(shape?: Shape | undefined): void {
    this.redraw();
  }

  protected onPostDraw(render: Render): void {
    const lineDash = [3, 5];
    if (
      this.hoverShape != this.editor.selectedShape &&
      this.hoverShape &&
      !this.isUpdatingSelectedShape
    ) {
      //draw
      const bound = this.hoverShape.getBound();
      render.drawRect(new Point(bound.x, bound.y), bound.width, bound.height, {
        mode: "stroke",
        strokeColor: "orange",
        lineDash,
      });
    }

    if (this.editor.selectedShape) {
      const bound = this.editor.selectedShape.getBound();
      //draw
      render.drawRect(new Point(bound.x, bound.y), bound.width, bound.height, {
        mode: "stroke",
        strokeColor: "#000000",
        lineDash,
      });

     
    }
  }

  protected onMouseDrag(e: EditorMouseEvent): void {
    if (this.editor.selectedShape) {
      this.isUpdatingSelectedShape = true;
      this.editor.selectedShape.x = e.wp.x - this.selectedShapeOffset.x;
      this.editor.selectedShape.y = e.wp.y - this.selectedShapeOffset.y;
      this.redraw();
    }
  }
  protected onMouseDragEnd(e: EditorMouseEvent): void {
    this.isUpdatingSelectedShape = false;
  }
  protected onSelectedShapeChange(shape?: Shape | undefined): void {}
  protected onSelectedToolChange(tool?: Tool | undefined): void {
    if (tool == this.tool) {
      this.redraw();
    }
  }
}

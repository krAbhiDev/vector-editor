import Point from "../../others/Point";
import { Render } from "../../others/Render";
import { ToolPlugin } from "../core/Plugin";
import { Shape } from "../core/Shape";
import { Tool } from "../core/Tool";
import VectorEditor from "../core/VectorEditor";
import { EditorMouseEvent } from "../core/common";

export class SelectAndTransformPlugin extends ToolPlugin {
  protected hoverShape?: Shape;
  protected selectedShapeOffset = new Point();
  protected isUpdatingSelectedShape = false;
  protected onActivate(editor: VectorEditor): void {
    //create tool
    const tool = new Tool({ name: "Select" });
    this.registerTool(tool);
  }
  protected onDeActivate(): void {}
  protected onMouseDown(e: EditorMouseEvent): void {
    const wPoint = this.editor.screenToWorld(new Point(e.x, e.y));
    let selectedShape: Shape | undefined = undefined;
    for (let i = this.editor.shapes.length - 1; i >= 0; i--) {
      const shape = this.editor.shapes[i];
      if (shape.isPointInside(wPoint.x, wPoint.y)) {
        //shape is
        selectedShape = shape;
        break;
      }
    }
    if (selectedShape) {
      this.selectedShapeOffset = wPoint
        .clone()
        .sub(new Point(selectedShape.x, selectedShape.y));
    }
    if (selectedShape != this.editor.selectedShape) {
      this.editor.selectedShape = selectedShape;

      this.redraw();
    }
  }
  protected onMouseMove(e: EditorMouseEvent): void {
    //check if mouse is over a shape
    //loop over  all shapes in reverse
    const wPoint = this.editor.screenToWorld(new Point(e.x, e.y));
    let hoverShape: Shape | undefined = undefined;
    for (let i = this.editor.shapes.length - 1; i >= 0; i--) {
      const shape = this.editor.shapes[i];
      if (shape.isPointInside(wPoint.x, wPoint.y)) {
        //shape is
        hoverShape = shape;
        break;
      }
    }
    //if hover shape changed
    if (hoverShape != this.hoverShape) {
      this.hoverShape = hoverShape;
      this.redraw();
    }
  }

  protected onDraw(render: Render): void {
    if (
      this.hoverShape != this.editor.selectedShape &&
      this.hoverShape &&
      !this.isUpdatingSelectedShape
    ) {
      //draw
      const bound = this.hoverShape.getBounds();
      render.drawRect(new Point(bound.x, bound.y), bound.width, bound.height, {
        mode: "stroke",
        strokeColor: "#000000",
      });
    }

    if (this.editor.selectedShape) {
      //draw
      const bound = this.editor.selectedShape.getBounds();
      render.drawRect(new Point(bound.x, bound.y), bound.width, bound.height, {
        mode: "stroke",
        strokeColor: "#00ff00",
      });
    }
  }

  protected onMouseDrag(e: EditorMouseEvent): void {
    if (this.editor.selectedShape) {
      this.isUpdatingSelectedShape = true;
      const wPoint = this.editor.screenToWorld(new Point(e.x, e.y));
      this.editor.selectedShape.x = wPoint.x - this.selectedShapeOffset.x;
      this.editor.selectedShape.y = wPoint.y - this.selectedShapeOffset.y;
      this.redraw();
    }
  }
  protected onMouseDragEnd(e: EditorMouseEvent): void {
    this.isUpdatingSelectedShape = false;
  }
  protected onSelectedShapeChange(shape?: Shape | undefined): void {
    console.log("SelectAndTransformPlugin::onSelectedShapeChange", shape);
  }
}

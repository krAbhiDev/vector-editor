import Point from "../../others/Point";
import { Render } from "../../others/Render";
import { Plugin } from "../core/Plugin";
import {
  EditorKeyEvent,
  EditorMouseEvent,
  EditorWheelEvent,
} from "../core/common";

export class PanZoomPlugin extends Plugin {
  /**
   * - pan with middle button or space key pressed => middle down and  mouse move
   * - zoom with mouse wheel => ctrl + mouse wheel
   * - vertical scroll => wheel
   * - horizontal scroll => shift + wheel
   */
  private startDragPoint = new Point();
  private isPan = false;
  get offset() {
    return this.properties.panOffset;
  }

  protected onMouseDown(e: EditorMouseEvent): void {
    this.capturePointer(e);
  }
  protected onMouseUp(e: EditorMouseEvent): void {
    this.releasePointer(e);
  }
  protected onMouseDrag(e: EditorMouseEvent): void {
    //if mouse middle button clicked
    if (!this.isPan) return;
    const mv = new Point(e.x, e.y);
    this.offset.x = mv.x - this.startDragPoint.x;
    this.offset.y = mv.y - this.startDragPoint.y;
    this.redraw();
  }
  protected onMouseDragEnd(e: EditorMouseEvent): void {
    this.isPan = false;
  }
  protected onMouseDragStart(e: EditorMouseEvent): void {
    //if mouse middle button clicked
    if (!(e.pe.buttons == 4 || this.key == " ")) return;
    this.isPan = true;
    const dp = new Point(e.x, e.y);
    this.startDragPoint.x = dp.x - this.offset.x;
    this.startDragPoint.y = dp.y - this.offset.y;
    this.redraw();
  }
  protected onMouseWheel(e: EditorWheelEvent): void {
    //only if ctrl key is pressed
    if (!e.we.ctrlKey) return;
    e.we.preventDefault();
    const point = new Point(e.x, e.y);
    const zoomFactor = e.we.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = this.properties.zoom * zoomFactor;
    if (
      newZoom >= this.properties.minZoom &&
      newZoom <= this.properties.maxZoom
    ) {
      // Calculate the translation needed to keep the mouse cursor fixed
      const scale = newZoom / this.properties.zoom;
      const dx = (point.x - this.offset.x) * (1 - scale);
      const dy = (point.y - this.offset.y) * (1 - scale);

      this.offset.x += dx;
      this.offset.y += dy;

      this.properties.zoom = newZoom;
      this.redraw();
    }
  }
  protected onPreDraw(render: Render): void {
    render.ctx.save();
    render.ctx.translate(this.offset.x, this.offset.y);
    render.ctx.scale(this.properties.zoom, this.properties.zoom);
  }
  protected onPostDraw(render: Render): void {
    render.ctx.restore();
  }
}

import Point from "../../others/Point";
import { Render } from "../../others/Render";
import { Plugin } from "../core/Plugin";
import { CircleShape, RectShape } from "../core/Shape";
import { Tool } from "../core/Tool";

export class RenderPlugin extends Plugin {
  protected override onDraw(render: Render) {
    this.editor.shapes.forEach((shape) => {
      if (shape instanceof CircleShape) {
        render.drawCircle(new Point(shape.x, shape.y), shape.radius, {
          fillColor: shape.color,
          mode: shape.isFill ? "fill" : "stroke",
        });
      } else if (shape instanceof RectShape) {
        render.drawRect(
          new Point(shape.x, shape.y),
          shape.width,
          shape.height,
          {
            fillColor: shape.color,
            mode: shape.isFill ? "fill" : "stroke",
          }
        );
      }
    });
  }
  protected onPreDraw(render: Render): void {}
  protected onPostDraw(render: Render): void {}

  protected onSelectedToolChange(tool?: Tool | undefined): void {
    console.log("RenderPlugin::onSelectedToolChange", tool);
  }
}

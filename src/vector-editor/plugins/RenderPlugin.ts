import Point from "../../others/Point";
import { Render } from "../../others/Render";
import { Plugin } from "../core/Plugin";
import { Circle } from "../core/Shape";
import { Tool } from "../core/Tool";

export class RenderPlugin extends Plugin {
  protected override onDraw(render: Render) {
    this.editor.shapes.forEach((shape) => {
      if (shape instanceof Circle) {
        render.drawCircle(
          new Point(shape.x.value, shape.y.value),
          shape.radius.value,
          {
            fillColor: shape.color.value,
            mode: shape.isFill.value ? "fill" : "stroke",
          }
        );
      }
    });
  }
  protected onPreDraw(render: Render): void {}
  protected onPostDraw(render: Render): void {}

  protected  onSelectedToolChange(tool?: Tool | undefined): void {
    console.log("RenderPlugin::onSelectedToolChange",tool)
  }
}

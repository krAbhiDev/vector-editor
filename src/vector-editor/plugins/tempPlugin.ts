import { Plugin, ToolPlugin } from "../core/Plugin";
import { Tool } from "../core/Tool";
import VectorEditor from "../core/VectorEditor";
import { EditorMouseEvent, PluginInfo } from "../core/common";
import { SelectAndTransformPlugin } from "./SelectAndTransformPlugin";

export class RectPlugin extends ToolPlugin {
  protected onActivate(editor: VectorEditor): void {
    //create tool
    const tool = new Tool({ name: "Rect" });
    this.registerTool(tool);
  }
  protected onDeActivate(): void {}
  protected onMouseMove(e: EditorMouseEvent): void {}
}

const plugins: PluginInfo[] = [
  { pluginType: SelectAndTransformPlugin, name: "SelectAndTransformPlugin" },
  { pluginType: RectPlugin, name: "RectPlugin" },
];

export default plugins;

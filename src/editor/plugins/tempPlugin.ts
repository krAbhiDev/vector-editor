import { Plugin } from "../core/Plugin";
import VectorEditor from "../core/VectorEditor";
import { PluginInfo } from "../core/common";
import { EllipsePlugin } from "./EllipsePlugin";
import { RectPlugin } from "./RectPlugin";
import { SelectAndTransformPlugin } from "./SelectAndTransformPlugin";

const plugins: PluginInfo[] = [
  { pluginType: SelectAndTransformPlugin, name: "SelectAndTransformPlugin" },
  { pluginType: RectPlugin, name: "RectPlugin" },
  { pluginType: EllipsePlugin, name: "EllipsePlugin" },
];

export default plugins;

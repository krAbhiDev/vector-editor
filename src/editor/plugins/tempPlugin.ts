import { Plugin } from "../core/Plugin";
import VectorEditor from "../core/VectorEditor";
import { PluginInfo } from "../core/common";
import { RectPlugin } from "./RectPlugin";
import { SelectAndTransformPlugin } from "./SelectAndTransformPlugin";

const plugins: PluginInfo[] = [
  { pluginType: SelectAndTransformPlugin, name: "SelectAndTransformPlugin" },
  { pluginType: RectPlugin, name: "RectPlugin" },
];

export default plugins;

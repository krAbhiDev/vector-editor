import { useEffect, useRef } from "react";
import VectorEditor from "./core/VectorEditor";
import { RenderPlugin } from "./plugins/RenderPlugin";
import { PanZoomPlugin } from "./plugins/PanZoomPlugin";
import plugins from "./plugins/tempPlugin";
export function VectorApp() {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<VectorEditor>();
  useEffect(() => {
    editorRef.current = new VectorEditor(mainRef.current!);
    const editor = editorRef.current;
    editor.addPlugin({
      name: "RenderPlugin",
      pluginType: RenderPlugin,
      order: 998,
    });
    editor.addPlugin({
      name: "PanZoomPlugin",
      pluginType: PanZoomPlugin,
      order: 999,
    });
    plugins.forEach(({ pluginType: P, name, order }) => {
      editor.addPlugin({
        name,
        pluginType: P,
        order,
      });
    });
  }, []);

  return (
    <div
      ref={mainRef}
      className=" bg-slate-100 w-full fixed h-full p-5 flex justify-center self-center"
    ></div>
  );
}
export default function () {
  return (
    <>
      <VectorApp />
    </>
  );
}

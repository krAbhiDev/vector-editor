import { useEffect, useRef } from "react";
import VectorEditor from "./core/VectorEditor";
import { PropertyPanel } from "./core/panels/PropertyPanel";
import { Circle, Shape } from "./core/Shape";
import { setTimer } from "../others/utils";
import { annotationTest } from "./annotation";
import { RenderPlugin } from "./plugins/RenderPlugin";
import { PanZoomPlugin } from "./plugins/PanZoomPlugin";
function add(...nums: any) {
  //sum of all
  return nums[0] + nums[1];
}
function logMany(...args: any) {
  const sum = add(args[0], args[1]);
  console.log("sum", args, sum);
}
function Test() {
  useEffect(() => {
    // arrayTest();
    logMany(1, 3, "ol");
    // annotationTest();
  }, []);
  return <div></div>;
}
export function _VectorApp() {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<VectorEditor>();
  useEffect(() => {
    editorRef.current = new VectorEditor(mainRef.current!);
    const editor = editorRef.current;
    editor.addPlugin(new RenderPlugin(), "RenderPlugin");
    editor.addPlugin(new PanZoomPlugin(), "PanZoomPlugin");
    //add random circle shape
    setTimer((t) => {
      const circle = new Circle();
      circle.x.value = Math.random() * 500;
      circle.y.value = Math.random() * 300;
      circle.radius.value = Math.random() * 100;

      circle.color.value = `rgb(${Math.random() * 255},${Math.random() * 255},${
        Math.random() * 255
      })`;
      editor.addShape(circle);
    }, 2000);
  }, []);

  return (
    <div
      ref={mainRef}
      className=" w-full fixed h-full p-5 flex justify-center self-center"
    ></div>
  );
  return (
    <div className="w-full fixed h-full p-5 flex justify-center self-center">
      <div ref={mainRef} className="bg-red-50 w-full h-full flex flex-row">
        <div className="bg-green-200 flex-1 relative">
          {/* tool-panel */}
          <div className="h-[40px] bg-red-300 z-50 absolute p-2 top-3 left-1/2   -translate-x-1/2 flex flex-row gap-1">
            <button>Arrow</button>
            <button>Nothing</button>
            <button>Arrow</button>
          </div>
          {/* editor-panel */}
          <div className="absolute top-0 left-0 bg-orange-200 w-full h-full">
            canvas
          </div>
        </div>
        {/* property panel */}
        <div className="bg-blue-200 w-[200px] "></div>
      </div>
    </div>
  );
}
export default function VectorApp() {
  return (
    <>
      {/* <Test /> */}
      <_VectorApp />
    </>
  );
}

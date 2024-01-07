import { useEffect, useRef } from "react";
import VectorEditor, {
  Circle,
  Property,
  PropertyPanel,
  Shape,
} from "./VectorEditor";
import { setTimer } from "../others/utils";

function PropertyPanelTest() {
  // useEffect(() => {
  //   const x = new Property(100, "number", "x");
  //   const xObserver = (value: any) => {
  //     console.log("x", value);
  //   };
  //   const id = x.addObserver(xObserver);
  //   x.value = 200;
  //   x.value = 300;
  //   x.value = 400;
  //   console.log(x);
  //   id.remove()
  // }, []);

  useEffect(() => {
    const shape = new Shape();
    const circle = new Circle();
    const panel = new PropertyPanel();
    panel.setSelectedShape(shape);

    circle.color.addObserver((value) => {
      console.log("circle color", value);
    });
    circle.x.addObserver((value) => {
      console.log("circle x", value);
    });
    circle.isFill.addObserver((value) => {
      console.log("circle isFill", value);
    });

    setTimer(
      (times: number) => {
        shape.x.value = times * 10;
      },
      1000,
      0,
      3,
      () => {
        panel.setSelectedShape(circle);
        setTimer(
          (times: number) => {
            circle.radius.value = times * 10;
          },
          1000,
          0,
          3
        );
      }
    );
  }, []);
  return <div></div>;
}
export default function VectorApp() {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const editor = useRef<VectorEditor>();
  useEffect(() => {
    editor.current = new VectorEditor(mainRef.current!);
  }, []);
  // return (
  //   <>
  //     <PropertyPanelTest />
  //   </>
  // );

  return (
    <div
      ref={mainRef}
      className="w-full fixed h-full p-5 flex justify-center self-center"
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

import { MutableRefObject, useEffect, useRef, useState } from "react";
import AutoCanvas from "./AutoCanvas";
import paper from "paper/dist/paper-core";
export type PaperScope = paper.PaperScope;
interface Props {
  paperScopeRef: MutableRefObject<paper.PaperScope | null>;
}
export default function PaperCanvas(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    props.paperScopeRef.current = new paper.PaperScope();
    const paperScope = props.paperScopeRef.current;
    if (!canvas) return;
    paperScope.setup(canvas);

    const resizeCallback = () => {
      paperScope.view.viewSize.set(canvas.width, canvas.height);
    };
    window.addEventListener("resize", resizeCallback);
    return () => {
      paperScope.view.remove();
      window.removeEventListener("resize", resizeCallback);
    };
  }, [props.paperScopeRef, canvasRef]);
  return <AutoCanvas canvasRef={canvasRef} />;
}

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
    return () => {
      paperScope.view.remove();
    };
  }, [props.paperScopeRef, canvasRef]);
  return <AutoCanvas canvasRef={canvasRef} />;
}
[
  {
      "x": 225,
      "y": 175
  },
  {
      "x": 244,
      "y": 50
  },
  {
      "x": 373,
      "y": 48
  },
  {
      "x": 399,
      "y": 108
  },
  {
      "x": 363,
      "y": 223
  }
]
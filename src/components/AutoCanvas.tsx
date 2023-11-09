import {
  ForwardedRef,
  MutableRefObject,
  Ref,
  RefObject,
  forwardRef,
  useEffect,
  useRef,
} from "react";
interface AutoCanvasProps {
  canvasRef?: MutableRefObject<HTMLCanvasElement|null>;
}
export default function AutoCanvas(props: AutoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (props.canvasRef) {
      props.canvasRef.current = canvasRef.current!!;
    }
    console.log("AutoCanvas effect called");
    const canvas = canvasRef.current!!;
    const parent = canvas.parentElement!;
    //get parent width and height
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const resizeCallback = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    window.addEventListener("resize", resizeCallback);
    return () => {
      window.removeEventListener("resize", resizeCallback);
    };
  }, []);
  return (
    <div className="canvas-wrapper">
      <canvas ref={canvasRef} className="auto-canvas"></canvas>
    </div>
  );
}

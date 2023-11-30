import { useEffect, useRef } from "react";
import { Color } from "../others/Color";
import { Render } from "../others/Render";
import AutoCanvas from "../components/AutoCanvas";
import { randomPoints, rad2deg, deg2rad } from "../others/utils";
import {
  triangulatePolyline,
  triangulatePolylineInMiter,
} from "../others/math";
import Point from "../others/Point";

export default () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!!;
    const render = new Render(ctx);
    onDraw(render);
  }, []);

  function onDraw(render: Render) {
    const points = triangulatePolyline(randomPoints(500, 500, 10), 10);
    //render.drawTriangles(points, { mode: "stroke" });
    const points2 = triangulatePolylineInMiter(
      [new Point(100, 400), new Point(250,100), new Point(200, 400)],
      50
    );
    render.drawTriangles(points2, { mode: "stroke" });
  }
  return (
    <div className=" h-screen w-screen">
      <AutoCanvas canvasRef={canvasRef} />
    </div>
  );
};

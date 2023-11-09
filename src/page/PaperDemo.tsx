"use client";

import AutoCanvas from "../components/AutoCanvas";
import { useEffect, useRef, useState } from "react";
import { PaperScope, Path, Color, Tool, Point } from "paper/dist/paper-core";

export default function PaperDemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const paper = new PaperScope();
    paper.setup(canvas);
    {
      var path = new Path();
      path.strokeColor = new Color("red");
      path.add(new Point(30, 75));
      path.add(new Point(30, 25));
      path.add(new Point(80, 25));
      path.add(new Point(80, 75));
      path.closed = true;
      path.fullySelected = true;

      var copy = path.clone();
      copy.fullySelected = true;
      copy.position.x += 100;

      // Smooth the segments of the copy:
      copy.smooth();
      copy.clone().position.x+=100
    }
    var tool = new Tool();
    var p: paper.Path;
    tool.onMouseDown = function (e: paper.ToolEvent) {
      p = new Path();
      p.strokeColor = Color.random();
      p.add(e.point);
    };

    tool.onMouseDrag = function (e: paper.ToolEvent) {
      p.arcTo(e.point);
    };
    var path = new Path.Rectangle([77, 75], [100, 100]);
    path.fillColor = Color.random();

    paper.view.update();
    paper.view.onFrame = () => {
      path.rotate(1);
    };
  }, []);

  return (
    <div className=" ">
      <div className="w-screen h-screen">
        <AutoCanvas canvasRef={canvasRef} />
      </div>
    </div>
  );
}

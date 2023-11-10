"use client";

import { useEffect, useRef, useState } from "react";
import { Point, convexHull } from "../others/math";
import PaperCanvas, { PaperScope } from "../components/PaperCanvas";
const POINTS = [
  {
    x: 225,
    y: 175,
  },
  {
    x: 244,
    y: 50,
  },
  {
    x: 373,
    y: 48,
  },
  {
    x: 399,
    y: 108,
  },
  {
    x: 363,
    y: 223,
  },
];
export default function ConvexHull() {
  const paperRef = useRef<PaperScope | null>(null);
  const pointsRef = useRef<Point[]>(POINTS);
  const dataRef = useRef<{ hullPath?: paper.Path }>({});
  useEffect(() => {
    const paperScope = paperRef.current!;
    if (!paperScope) return;
    makeHull();
    pointsRef.current.forEach((p) => {
      const circle = new paperScope.Path.Circle([p.x, p.y], 5);
      circle.fillColor = new paperScope.Color("black");
    });
    const tool = new paperScope.Tool();
    tool.onMouseDown = (e: paper.ToolEvent) => {
      const circle = new paperScope.Path.Circle(e.point, 5);
      circle.fillColor = new paperScope.Color("black");
      pointsRef.current.push(new Point(e.point.x, e.point.y));
      makeHull();
    };
  }, [paperRef]);

  function makeHull() {
    const paperScope = paperRef.current!;
    const data = dataRef.current;
    data.hullPath?.remove();
    data.hullPath = undefined;
    //new path
    const hullPoints = convexHull(pointsRef.current);
    console.log({ hullPoints });
    const path = new paperScope.Path();
    path.strokeColor = new paperScope.Color("black");
    for (let i = 0; i < hullPoints.length; i++) {
      const p = hullPoints[i];
      if (i == 0) {
        path.moveTo([p.x, p.y]);
      } else {
        path.lineTo([p.x, p.y]);
      }
    }
    path.closePath();
    data.hullPath = path;
  }
  return (
    <div className=" ">
      <div className="w-screen h-screen">
        <PaperCanvas paperScopeRef={paperRef} />
      </div>
    </div>
  );
}

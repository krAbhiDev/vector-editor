"use client";

import { useEffect, useRef } from "react";
import { convexHull } from "../others/math";
import PaperCanvas, { PaperScope } from "../components/PaperCanvas";
import Panel from "../components/Panel";
import { randomRange, repeat } from "../others/utils";
import Point from "../others/Point";

export default function ConvexHull() {
  const paperRef = useRef<PaperScope | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const dataRef = useRef<{
    hullPath?: paper.Path;
    hullPointsGroup?: paper.Group;
  }>({});
  useEffect(() => {
    const paperScope = paperRef.current!;
    if (!paperScope) return;
    random();
    const tool = new paperScope.Tool();
    tool.onMouseDown = (e: paper.ToolEvent) => {
      pointsRef.current.push(new Point(e.point.x, e.point.y));
      makeHull();
    };
  }, [paperRef]);

  function makeHull() {
    const paperScope = paperRef.current!;
    const data = dataRef.current;
    data.hullPath?.remove();
    data.hullPath = undefined;
    data.hullPointsGroup?.remove();
    data.hullPointsGroup = undefined;

    //group
    const group = new paperScope.Group();
    pointsRef.current.forEach((p) => {
      const circle = new paperScope.Path.Circle([p.x, p.y], 5);
      circle.fillColor = new paperScope.Color("black");
      group.addChild(circle);
    });
    data.hullPointsGroup = group;

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
  function clear() {
    pointsRef.current = [];
    makeHull();
  }
  function random() {
    const paperScope = paperRef.current!;
    const w = paperScope.view.viewSize.width;
    const h = paperScope.view.viewSize.height;
    clear();
    repeat(randomRange(3, 50), (_) => {
      pointsRef.current.push(
        new Point(randomRange(20, w - 20), randomRange(20, h - 20))
      );
    });
    makeHull();
  }
  return (
    <div className="w-screen h-screen p-3">
      <div className="w-full h-full relative">
        <Panel direction="top" align="left">
          <button onClick={clear} className="link ">
            clear
          </button>
          <button onClick={random} className="link ">
            random
          </button>
        </Panel>
        <div className="w-full h-full">
          <PaperCanvas paperScopeRef={paperRef} />
        </div>
      </div>
    </div>
  );
}

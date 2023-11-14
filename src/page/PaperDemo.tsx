"use client";

import AutoCanvas from "../components/AutoCanvas";
import { useEffect, useRef, useState } from "react";
import PaperCanvas, { PaperScope } from "../components/PaperCanvas";
import paper from "paper/dist/paper-core";
export default function PaperDemo() {
  const paperRef = useRef<PaperScope | null>(null);
  useEffect(() => {
    const ps = paperRef.current!;
    if (!ps) return;
    const black = new paper.Color("black");

    {
      const shape = new ps.Path.Circle([100, 100], 30);
      shape.strokeColor = black;

      const clone = shape.clone();
      clone.fullySelected = true;
      clone.position.x += 70;
      console.log({ segments: shape.segments });
    }
    {
      const shape = new ps.Path.Rectangle([100, 200, 70, 70]);
      shape.strokeColor = black;
      shape.selected = true;
      console.log({ segments: shape.segments });

      const clone = shape.clone();
      clone.smooth();
      clone.fullySelected = true;
      clone.position.x += 100;
      console.log({ clone: clone });
    }
    {
      const shape = new ps.Path.Line([100, 20], [300, 100]);
      shape.strokeColor = black;
      shape.selected = true;
      console.log({ segments: shape.segments });

      const clone = shape.clone();
      clone.add([100, 100]);
     clone.smooth({type:"continuous"});
      clone.selected = false;
      clone.position.x += 100;
      console.log({ clone: clone });
    }
  }, []);

  return (
    <div className=" ">
      <div className="w-screen h-screen">
        <PaperCanvas paperScopeRef={paperRef} />
      </div>
    </div>
  );
}

"use client";

import AutoCanvas from "../components/AutoCanvas";
import { useEffect, useRef, useState } from "react";
import Point from "../others/Point";

export default function PanZoom() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!!;
    const points: Point[] = [];
    let isDragging = false;
    let startDrag = new Point();
    let offset = new Point();
    let currentZoom = 1;
    const minZoom = 0.1; // Minimum zoom level
    const maxZoom = 8; // Maximum zoom level
    canvas.addEventListener("pointerdown", (e) => {
      const down = getMousePoint(e);
      console.log("offset", offset, "down", down);
      isDragging = true;
      startDrag.x = down.x - offset.x;
      startDrag.y = down.y - offset.y;

      canvas.setPointerCapture(e.pointerId);

      points.push(screenToWorld(down));
      onDraw();
    });
    canvas.addEventListener("pointerup", (e) => {
      isDragging = false;
      const up = getMousePoint(e);
      canvas.releasePointerCapture(e.pointerId);
    });
    canvas.addEventListener("pointermove", (e) => {
      const move = getMousePoint(e);
      if (isDragging) {
        offset.x = move.x - startDrag.x;
        offset.y = move.y - startDrag.y;
        onDraw();
      } else {
        const world = screenToWorld(move);
        const screen = worldToScreen(world);
        console.log("world", world, "screen", screen);
      }
    });
    canvas.addEventListener("wheel", (e) => {
      const point = getMousePoint(e as any);
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = currentZoom * zoomFactor;
      if (newZoom >= minZoom && newZoom <= maxZoom) {
        // Calculate the translation needed to keep the mouse cursor fixed
        const scale = newZoom / currentZoom;
        const dx = (point.x - offset.x) * (1 - scale);
        const dy = (point.y - offset.y) * (1 - scale);

        offset.x += dx;
        offset.y += dy;

        currentZoom = newZoom;
        onDraw();
      }
    });
    function onDraw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(offset.x, offset.y);
      ctx.scale(currentZoom, currentZoom);
      drawLines([new Point(0, 1000), new Point(0, 0), new Point(1000, 0)]);
      ctx.fillRect(70, 70, 100, 100);
      ctx.fillRect(200, 70, 100, 50);
      //draw circles
      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }
    onDraw();
    //utils
    function getMousePoint(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      } as Point;
    }
    function drawLines(points: Point[]) {
      if (points.length < 2) {
        return;
      }
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    }
    function screenToWorld(screen: Point) {
      const worldX = (screen.x - offset.x) / currentZoom;
      const worldY = (screen.y - offset.y) / currentZoom;
      return new Point(worldX, worldY);
    }
    function worldToScreen(world: Point) {
      const screenX = world.x * currentZoom + offset.x;
      const screenY = world.y * currentZoom + offset.y;
      return new Point(screenX, screenY);
    }
  }, []);

  return (
    <div className=" ">
      <div className="w-screen h-screen">
        <AutoCanvas canvasRef={canvasRef} />
      </div>
    </div>
  );
}

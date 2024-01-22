import { Color } from "./Color";
import Point from "./Point";
import { Rect } from "./Rect";

interface Style {
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  mode?: "stroke" | "stroke_fill" | "fill";
  font?: string;
  lineDash?: number[];
}
export class Render {
  constructor(public ctx: CanvasRenderingContext2D) {}

  public get width(): number {
    return this.ctx.canvas.width;
  }

  public get height(): number {
    return this.ctx.canvas.height;
  }
  public drawPolyLines(points: Point[], style: Style = {}) {
    this.ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        this.ctx.moveTo(point.x, point.y);
      } else {
        this.ctx.lineTo(point.x, point.y);
      }
    });
    this.applyStyle(style);
  }
  private applyStyle(style: Style) {
    const {
      fillColor = "black",
      strokeColor = "red",
      strokeWidth = 1,
      mode = "fill",
      font = "18px Arial",
      lineDash,
    } = style;
    this.ctx.save();
    this.ctx.fillStyle = fillColor;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = strokeWidth;
    this.ctx.font = font;
    if (lineDash) {
      this.ctx.setLineDash(lineDash);
    }

    switch (mode) {
      case "fill":
        this.ctx.fill();
        break;
      case "stroke":
        this.ctx.stroke();
        break;
      default:
        this.ctx.fill();
        this.ctx.stroke();
    }
    this.ctx.restore();
  }
  public drawTrianglesWithIndices(
    points: Point[],
    indices: number[],
    style: Style = {}
  ) {
    if (indices.length % 3 !== 0) {
      throw new Error(
        "Invalid number of indices. Indices should be divisible by 3 to form triangles."
      );
    }

    this.ctx.beginPath();

    for (let i = 0; i < indices.length; i += 3) {
      const index1 = indices[i];
      const index2 = indices[i + 1];
      const index3 = indices[i + 2];
      if (
        index1 >= points.length ||
        index2 >= points.length ||
        index3 >= points.length
      ) {
        throw new Error("Invalid index. Index exceeds the number of points.");
      }
      const point1 = points[index1];
      const point2 = points[index2];
      const point3 = points[index3];

      this.ctx.moveTo(point1.x, point1.y);
      this.ctx.lineTo(point2.x, point2.y);
      this.ctx.lineTo(point3.x, point3.y);
      this.ctx.lineTo(point1.x, point1.y);
    }

    this.ctx.closePath();
    this.applyStyle(style);
    this.ctx.fill();
    this.ctx.stroke();
  }
  public drawTriangles(points: Point[], style: Style = {}) {
    const len = points.length - (points.length % 3);

    this.ctx.beginPath();

    for (let i = 0; i < len; i += 3) {
      const point1 = points[i];
      const point2 = points[i + 1];
      const point3 = points[i + 2];

      this.ctx.moveTo(point1.x, point1.y);
      this.ctx.lineTo(point2.x, point2.y);
      this.ctx.lineTo(point3.x, point3.y);
      this.ctx.lineTo(point1.x, point1.y);
    }

    this.ctx.closePath();
    this.applyStyle(style);
  }
  public drawCircle(point: Point, radius: number, style: Style = {}) {
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    this.applyStyle(style);
  }
  public drawLine(point1: Point, point2: Point, style: Style = {}) {
    this.ctx.beginPath();
    this.ctx.moveTo(point1.x, point1.y);
    this.ctx.lineTo(point2.x, point2.y);
    this.applyStyle(style);
  }
  public drawRect(
    point: Point,
    width: number,
    height: number,
    style: Style = {}
  ) {
    this.ctx.beginPath();
    this.ctx.rect(point.x, point.y, width, height);
    this.applyStyle(style);
  }
  //draw Rect
  public drawRect2(rect: Rect, style: Style = {}) {
    this.drawRect(new Point(rect.x, rect.y), rect.width, rect.height, style);
  }
  public drawText(point: Point, text: string, style: Style = {}) {
    this.ctx.beginPath();
    this.ctx.fillText(text, point.x, point.y);
    this.applyStyle(style);
  }
  //draw ellipse
  public drawEllipse(point: Point, radiusX: number, radiusY: number, style: Style = {}) {
    this.ctx.beginPath();
    this.ctx.ellipse(point.x, point.y, radiusX, radiusY, 0, 0, Math.PI * 2);
    this.applyStyle(style);
  }
  //clear canvas
  public clear(color = Color.fromHex("#eeeeee")) {
    this.drawRect(new Point(0, 0), this.width, this.height, {
      fillColor: color.toString(),
      mode: "fill",
    });
  }
}

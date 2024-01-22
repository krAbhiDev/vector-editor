import { Rect } from "../../others/Rect";

export class Shape {
  protected _x = 0;
  protected _y = 0;
  color = "#000000";
  isFill = true;
  strokeWidth = 1;
  isPointInside(x: number, y: number) {
    return false;
  }
  getBound() {
    return new Rect(this.x, this.y, 0, 0);
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  set x(val) {
    this._x = val;
  }
  set y(val) {
    this._y = val;
  }
}

export class EllipseShape extends Shape {
  radiusX = 50;
  radiusY = 30;
  isPointInside(x: number, y: number): boolean {
    return (
      (x - this.x) ** 2 / this.radiusX ** 2 +
        (y - this.y) ** 2 / this.radiusY ** 2 <=
      1
    );
  }
  getBound(): Rect {
    return new Rect(
      this.x - this.radiusX,
      this.y - this.radiusY,
      this.radiusX * 2,
      this.radiusY * 2
    );
  }

  get left() {
    return this.x - this.radiusX;
  }
  get top() {
    return this.y - this.radiusY;
  }
  get right() {
    return this.x + this.radiusX;
  }
  get bottom() {
    return this.y + this.radiusY;
  }
  set left(val) {
    const rad = Math.abs(this.right - val) * 0.5;
    this.x = val + rad;
    this.radiusX = rad;
  }
  set top(val) {
    const rad = Math.abs(this.bottom - val) * 0.5;
    this.y = val + rad;
    this.radiusY = rad;
  }
  set right(val) {
    const rad = Math.abs(this.left - val) * 0.5;
    this.x = val - rad;
    this.radiusX = rad;
  }
  set bottom(val) {
    const rad = Math.abs(this.top - val) * 0.5;
    this.y = val - rad;
    this.radiusY = rad;
  }
}
export class RectShape extends Shape {
  rect = new Rect();
  isPointInside(x: number, y: number): boolean {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }
  getBound(): Rect {
    return this.rect.clone();
  }
  get width() {
    return this.rect.width;
  }
  get height() {
    return this.rect.height;
  }
  set width(val) {
    this.rect.width = val;
  }
  set height(val) {
    this.rect.height = val;
  }
  get x(): number {
    return this.rect.x;
  }
  get y(): number {
    return this.rect.y;
  }
  set x(val: number) {
    this.rect.x = val;
  }
  set y(val: number) {
    this.rect.y = val;
  }
}
export class LineShape extends Shape {
  x2 = 10;
  y2 = 10;
  getBound(): Rect {
    return new Rect(this.x, this.y, this.x2 - this.x, this.y2 - this.y);
  }
}

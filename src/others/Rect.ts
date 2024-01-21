import Point from "./Point";

export class Rect {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public width: number = 0,
    public height: number = 0
  ) {}
  get left() {
    return this.x;
  }
  get top() {
    return this.y;
  }
  get right() {
    return this.x + this.width;
  }
  get bottom() {
    return this.y + this.height;
  }
  get center() {
    return new Point(this.x + this.width * 0.5, this.y + this.height * 0.5);
  }
  get topLeft() {
    return new Point(this.x, this.y);
  }
  get topRight() {
    return new Point(this.x + this.width, this.y);
  }
  get bottomLeft() {
    return new Point(this.x, this.y + this.height);
  }
  get bottomRight() {
    return new Point(this.x + this.width, this.y + this.height);
  }
  set left(value: number) {
    this.width = this.right - value;
    this.x = value;
  }
  set top(value: number) {
    this.height = this.bottom - value;
    this.y = value;
  }
  set right(value: number) {
    this.width = value - this.x;
  }
  set bottom(value: number) {
    this.height = value - this.y;
  }
  set center(value: Point) {
    this.x = value.x - this.width * 0.5;
    this.y = value.y - this.height * 0.5;
  }
  set topLeft(value: Point) {
    this.x = value.x;
    this.y = value.y;
  }
  set topRight(value: Point) {
    this.x = value.x - this.width;
    this.y = value.y;
  }
  set bottomLeft(value: Point) {
    this.x = value.x;
    this.y = value.y - this.height;
  }
  set bottomRight(value: Point) {
    this.x = value.x - this.width;
    this.y = value.y - this.height;
  }
  //from center and size
  static fromCenter(center: Point, width: number, height: number) {
    return new Rect(
      center.x - width * 0.5,
      center.y - height * 0.5,
      width,
      height
    );
  }

  //from two points
  static fromPoints(p1: Point, p2: Point) {
    return new Rect(p1.x, p1.y, p2.x, p2.y);
  }
  //from left top right bottom
  static fromLTRB(l: number, t: number, r: number, b: number) {
    return new Rect(l, t, r - l, b - t);
  }
  isPointInside(x: number, y: number) {
    return (
      x >= this.left && x <= this.right && y >= this.top && y <= this.bottom
    );
  }
  isRectInside(rect: Rect) {
    return (
      this.left <= rect.left &&
      this.right >= rect.right &&
      this.top <= rect.top &&
      this.bottom >= rect.bottom
    );
  }
  clone() {
    return new Rect(this.x, this.y, this.width, this.height);
  }
  move(x: number, y: number) {
    this.x += x;
    this.y += y;
    return this;
  }
  //extend size but center must be same
  extend(width: number, height: number) {
    this.x -= width * 0.5;
    this.y -= height * 0.5;
    this.width += width;
    this.height += height;
    return this;
  }
  set(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    return this;
  }
}

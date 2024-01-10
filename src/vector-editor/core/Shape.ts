import { Observer } from "./Observer";

export class Shape {
  x = new Observer(0);
  y = new Observer(0);
  color = new Observer("#000000");
  isFill = new Observer(true);
  strokeWidth = new Observer(1);
}

export class Circle extends Shape {
  radius = new Observer(10);
}
export class Rectangle extends Shape {
  width = new Observer(10);
  height = new Observer(10);
}
export class Line extends Shape {
  x2 = new Observer(10);
  y2 = new Observer(10);
}

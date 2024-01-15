import { Rect } from "../../others/Rect";

export class Shape {
  x = 0;
  y = 0;
  color = "#000000";
  isFill = true;
  strokeWidth = 1;
  isPointInside(x: number, y: number) {
    return false;
  }
  getBounds() {
    return new Rect(this.x, this.y, 0, 0);
  }
}

export class CircleShape extends Shape {
  radius = 10;
  isPointInside(x: number, y: number): boolean {
    return Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2) <= this.radius;
  }
  getBounds(): Rect {
    return new Rect(
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }
}
export class RectShape extends Shape {
  width = 10;
  height = 10;
  isPointInside(x: number, y: number): boolean {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }
  getBounds(): Rect {
    return new Rect(this.x, this.y, this.width, this.height);
  }
}
export class LineShape extends Shape {
  x2 = 10;
  y2 = 10;
  getBounds(): Rect {
    return new Rect(this.x, this.y, this.x2 - this.x, this.y2 - this.y);
  }
}

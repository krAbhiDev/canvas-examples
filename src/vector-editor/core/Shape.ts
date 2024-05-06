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
  getBounds() {
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
  rect = new Rect();
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
  getBounds(): Rect {
    return new Rect(this.x, this.y, this.x2 - this.x, this.y2 - this.y);
  }
}


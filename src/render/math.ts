export class Point {
  constructor(public x = 0, public y = 0) {}

  //constant like ZERO UP
  static get ZERO() {
    return new Point(0, 0);
  }
  static get UP() {
    return new Point(0, 1);
  }
  static get DOWN() {
    return new Point(0, -1);
  }
  static get LEFT() {
    return new Point(-1, 0);
  }
  static get RIGHT() {
    return new Point(1, 0);
  }

  clone() {
    return new Point(this.x, this.y);
  }
  add(p: Point) {
    this.x += p.x;
    this.y += p.y;
    return this;
  }
  sub(p: Point) {
    this.x -= p.x;
    this.y -= p.y;
    return this;
  }
  scale(s: number) {
    this.x *= s;
    this.y *= s;
    return this;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  normalize() {
    let len = this.length();
    if (len == 0) return new Point(0, 0);
    this.x /= len;
    this.y /= len;
    return this;
  }
}
export class Rect {
  constructor(
    public left: number,
    public top: number,
    public right: number,
    public bottom: number
  ) {}
  static fromLTRB(l: number, t: number, r: number, b: number) {
    return new Rect(l, t, r, b);
  }

  static fromXYWH(x: number, y: number, w: number, h: number) {
    return new Rect(x, y, x + w, y + h);
  }

  //(centerX, centerY, halfWidth, halfHeight)
  static fromCenter(
    centerX: number,
    centerY: number,
    halfWidth: number,
    halfHeight: number
  ) {
    return new Rect(
      centerX - halfWidth,
      centerY - halfHeight,
      centerX + halfWidth,
      centerY + halfHeight
    );
  }

  //get width height center
  get width() {
    return this.right - this.left;
  }
  get height() {
    return this.bottom - this.top;
  }
  get centerX() {
    return (this.left + this.right) / 2;
  }
  get centerY() {
    return (this.top + this.bottom) / 2;
  }
  get center() {
    return new Point(
      (this.left + this.right) / 2,
      (this.top + this.bottom) / 2
    );
  }
}
export class RRect {}

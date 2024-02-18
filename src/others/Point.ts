import { deg2rad, rad2deg } from "./utils";

export default class Point {
  constructor(public x: number = 0, public y: number = 0) {}
  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  setFromPoint(p: Point) {
    this.x = p.x;
    this.y = p.y;
    return this
  }

  add(p: Point): Point {
    this.x += p.x;
    this.y += p.y;
    return this;
  }

  sub(p: Point): Point {
    this.x -= p.x;
    this.y -= p.y;
    return this;
  }

  scale(num: number): Point {
    this.x *= num;
    this.y *= num;
    return this;
  }

  dot(p: Point): number {
    return this.x * p.x + this.y * p.y;
  }

  clone(): Point {
    return new Point(this.x, this.y);
  }

  angle(): number {
    return Math.atan2(this.y, this.x);
  }
  degree() {
    return this.angle() * rad2deg;
  }

  angleWith(p: Point): number {
    const dotProduct = this.dot(p);
    const magnitudeProduct = this.length() * p.length();
    return Math.acos(dotProduct / magnitudeProduct);
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  lengthSqr(): number {
    return this.x * this.x + this.y * this.y;
  }
  normalize(): Point {
    const magnitude = this.length();
    if (magnitude === 0) {
      return new Point(0, 0); // Avoid division by zero
    }
    this.x /= magnitude;
    this.y /= magnitude;
    return this;
  }
  rotate(radian: number): Point {
    const rotatedX = this.x * Math.cos(radian) - this.y * Math.sin(radian);
    const rotatedY = this.x * Math.sin(radian) + this.y * Math.cos(radian);
    this.x = rotatedX;
    this.y = rotatedY;
    return this;
  }
  rotateByDegree(deg: number) {
    return this.rotate(deg2rad * deg);
  }
  getNormal() {
    return this.clone().rotateByDegree(90).normalize();
  }
  inverse() {
    return this.scale(-1);
  }
  toString() {
    return `x: ${this.x}, y: ${this.y}`;
  }
}



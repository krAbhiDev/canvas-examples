import { Point, RRect, Rect } from "./math";

abstract class Render {
  abstract clear(color: Color): void;
  abstract flush(): void;
  abstract destroy(): void;
  abstract resize(width: number, height: number): void;
  abstract requestAnimationFrame(callback: () => void): void;

  //size
  abstract get width(): number;
  abstract get height(): number;

  //draw
  abstract drawCircle(center: Point, radius: number, paint: Paint): void;
  abstract drawLine(start: Point, end: Point, paint: Paint): void;
  abstract drawOval(rect: Rect, paint: Paint): void;
  abstract drawPath(path: Path, paint: Paint): void;
  abstract drawPoints(points: Point[], paint: Paint): void;
  abstract drawRect(rect: Rect, paint: Paint): void;
  abstract drawRRect(rrect: RRect, paint: Paint): void;
  abstract drawImage(image: Image, rect: Rect, paint: Paint): void;
  abstract drawArc(
    rect: Rect,
    startAngle: number,
    sweepAngle: number,
    paint: Paint
  ): void;
  //save restore
  abstract save(): void;
  abstract restore(): void;

  //matrix
  abstract translate(dx: number, dy: number): void;
  abstract scale(sx: number, sy: number): void;
  abstract rotate(deg: number, cx: number, cy: number): void;
  abstract skew(sx: number, sy: number): void;
  abstract setMatrix(matrix: Matrix): void;
  abstract concat(matrix: Matrix): void;

  //clip

  //text

  //pixels

  abstract makePath(): Path;
  abstract makePathFromSVG(svg: string): Path;
  //   abstract makeImage(): Image;
  //   abstract makeMatrix(): Matrix;
}
type Style = "fill" | "stroke" | "fillStroke";
type StrokeCap = "butt" | "round" | "square";
type StrokeJoin = "bevel" | "round" | "miter";
type BlendMode =
  | "clear"
  | "src"
  | "dst"
  | "srcOver"
  | "dstOver"
  | "srcIn"
  | "dstIn"
  | "srcOut"
  | "dstOut"
  | "srcATop"
  | "dstATop"
  | "xor"
  | "plus"
  | "modulate"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "colorDodge"
  | "colorBurn"
  | "hardLight"
  | "softLight"
  | "difference"
  | "exclusion"
  | "multiply"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity";
interface Paint {
  style?: Style;
  color?: Color;
  strokeWidth?: number;
  strokeCap?: StrokeCap;
  strokeJoin?: StrokeJoin;
  miterLimit?: number;
  antiAlias?: boolean;
  // blendMode?: BlendMode;
  // shader?: Shader;
  // imageFilter?: ImageFilter;
  // maskFilter?: MaskFilter;
  // colorFilter?: ColorFilter;
  // pathEffect?: PathEffect;
}
abstract class Shader {}
abstract class ImageFilter {}
abstract class MaskFilter {}
abstract class ColorFilter {}
abstract class PathEffect {}

class Color {
  r = 255;
  g = 255;
  b = 255;
  a = 255;

  constructor(r = 0, g = 0, b = 0, a = 255) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static fromRGBA(r = 0, g = 0, b = 0, a = 255) {
    return new Color(r, g, b, a);
  }
  static random(alpha = 255) {
    return new Color(
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255,
      alpha
    );
  }
}
enum FillType {
  Winding,
  EvenOdd,
}
enum PathOp {
  Difference,
  Intersect,
  Union,
  XOR,
  ReverseDifference,
}
abstract class Path {
  protected constructor() {}
  abstract addArc(oval: Rect, startAngle: number, sweepAngle: number): void;
  abstract addCircle(x: number, y: number, radius: number): void;
  abstract addOval(oval: Rect): void;
  abstract addRect(rect: Rect): void;
  abstract addRRect(rrect: RRect): void;
  abstract addPolyline(points: Point[]): void;

  abstract close(): void;
  abstract copy(): Path;
  abstract computeTightBounds(): Rect;
  abstract contains(x: number, y: number): boolean;
  abstract getBounds(): Rect;
  abstract reset(): void;
  abstract rewind(): void;
  abstract setFillType(fillType: FillType): void;
  abstract getFillType(): FillType;
  abstract simplify(): void;

  abstract delete(): void;

  abstract offset(dx: number, dy: number): void;
  abstract moveTo(x: number, y: number): void;
  abstract lineTo(x: number, y: number): void;
  abstract quadTo(x1: number, y1: number, x2: number, y2: number): void;
  abstract conicTo(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    w: number
  ): void;
  abstract cubicTo(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): void;
}

abstract class Image {}
abstract class Matrix {}

export { PathOp, FillType, Render, Color, Path, Image, Matrix };

export type { Style, Paint, StrokeCap, StrokeJoin, BlendMode };

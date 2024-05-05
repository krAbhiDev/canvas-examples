import {
  Color,
  Paint,
  Path,
  Render,
  Image,
  Matrix,
  StrokeCap,
  StrokeJoin,
  FillType,
} from "./Render";
import { Point, Rect, RRect } from "./math";

import CanvasKitInit from "canvaskit-wasm";
import * as CK from "canvaskit-wasm";

var _canvasKit: CK.CanvasKit | undefined = undefined;
export async function loadCanvasKit() {
  if (!_canvasKit) {
    _canvasKit = await CanvasKitInit({
      locateFile: (file) => "/" + file,
    });
    console.log("CanvasKit loaded");
  }
  return _canvasKit;
}
class SkiaConverter {
  toSkiaFillType(fillType: FillType): CK.FillType {
    switch (fillType) {
      case FillType.EvenOdd:
        return this.ck.FillType.EvenOdd;
      case FillType.Winding:
        return this.ck.FillType.Winding;
    }
  }
  constructor(private ck: CK.CanvasKit) {}
  toSkiaColor(color: Color): CK.Color {
    return this.ck.Color(color.r, color.g, color.b, color.a);
  }
  toSkiaRect(rect: Rect): CK.Rect {
    return this.ck.LTRBRect(rect.left, rect.top, rect.right, rect.bottom);
  }
  toSkiaCap(cap: StrokeCap): CK.StrokeCap {
    switch (cap) {
      case "butt":
        return this.ck.StrokeCap.Butt;
      case "round":
        return this.ck.StrokeCap.Round;
      case "square":
        return this.ck.StrokeCap.Square;
    }
  }
  toSkiaJoin(join: StrokeJoin): CK.StrokeJoin {
    switch (join) {
      case "bevel":
        return this.ck.StrokeJoin.Bevel;
      case "round":
        return this.ck.StrokeJoin.Round;
      case "miter":
        return this.ck.StrokeJoin.Miter;
    }
  }
  toSkiaPaint(paint: Paint): CK.Paint {
    let skiaPaint = new this.ck.Paint();
    if (paint.color) {
      skiaPaint.setColor(this.toSkiaColor(paint.color));
    }
    if (paint.strokeWidth) {
      skiaPaint.setStrokeWidth(paint.strokeWidth);
    }
    if (paint.strokeCap) {
      skiaPaint.setStrokeCap(this.toSkiaCap(paint.strokeCap));
    }
    if (paint.strokeJoin) {
      skiaPaint.setStrokeJoin(this.toSkiaJoin(paint.strokeJoin));
    }
    if (paint.miterLimit) {
      skiaPaint.setStrokeMiter(paint.miterLimit);
    }
    if (paint.antiAlias) {
      skiaPaint.setAntiAlias(paint.antiAlias);
    }
    return skiaPaint;
  }
}

export default class CanvasKitRender extends Render {
  surface: CK.Surface;
  skiaCanvas: CK.Canvas;
  converter: SkiaConverter;
  get canvasKit() {
    if (!_canvasKit) throw new Error("CanvasKit not loaded");
    return _canvasKit!!;
  }
  constructor(private htmlCanvas: HTMLCanvasElement) {
    super();
    this.converter = new SkiaConverter(this.canvasKit);
    this.surface = this.canvasKit.MakeWebGLCanvasSurface(htmlCanvas)!;
    this.skiaCanvas = this.surface.getCanvas();
  }
  resize(width: number, height: number): void {
    //recreate surface
    this.surface.delete();
    this.surface = this.canvasKit.MakeWebGLCanvasSurface(this.htmlCanvas)!;
    this.skiaCanvas = this.surface.getCanvas();
  }
  flush(): void {
    this.surface.flush();
  }
  requestAnimationFrame(callback: () => void): void {
    this.surface.requestAnimationFrame(callback);
  }
  get width(): number {
    return this.surface.width();
  }
  get height(): number {
    return this.surface.height();
  }

  destroy() {
    this.surface.delete();
  }
  clear(color: Color): void {
    this.skiaCanvas.clear(this.converter.toSkiaColor(color));
  }
  drawCircle(center: Point, radius: number, paint: Paint): void {
    const skiaPaint = this.converter.toSkiaPaint(paint);
    this.skiaCanvas.drawCircle(center.x, center.y, radius, skiaPaint);
    skiaPaint.delete();
  }
  drawLine(start: Point, end: Point, paint: Paint): void {
    const skiaPaint = this.converter.toSkiaPaint(paint);
    this.skiaCanvas.drawLine(start.x, start.y, end.x, end.y, skiaPaint);
    skiaPaint.delete();
  }
  drawOval(rect: Rect, paint: Paint): void {
    const skiaPaint = this.converter.toSkiaPaint(paint);
    this.skiaCanvas.drawOval(this.converter.toSkiaRect(rect), skiaPaint);
    skiaPaint.delete();
  }
  drawPath(path: Path, paint: Paint): void {
    const ckPath = path as CanvasKitPath;
    const skiaPaint = this.converter.toSkiaPaint(paint);
    this.skiaCanvas.drawPath(ckPath.skiaPath, skiaPaint);
    skiaPaint.delete();
  }
  drawPoints(points: Point[], paint: Paint): void {
    throw new Error("Method not implemented.");
  }
  drawRect(rect: Rect, paint: Paint): void {
    const skiaPaint = this.converter.toSkiaPaint(paint);
    this.skiaCanvas.drawRect(this.converter.toSkiaRect(rect), skiaPaint);
    skiaPaint.delete();
  }
  drawRRect(rrect: RRect, paint: Paint): void {
    throw new Error("Method not implemented.");
  }
  drawImage(image: Image, rect: Rect, paint: Paint): void {
    throw new Error("Method not implemented.");
  }
  drawArc(
    rect: Rect,
    startAngle: number,
    sweepAngle: number,
    paint: Paint
  ): void {
    this.skiaCanvas.drawArc(
      this.converter.toSkiaRect(rect),
      startAngle,
      sweepAngle,
      true,
      this.converter.toSkiaPaint(paint)
    );
  }
  save(): void {
    this.skiaCanvas.save();
  }
  restore(): void {
    this.skiaCanvas.restore();
  }
  translate(dx: number, dy: number): void {
    this.skiaCanvas.translate(dx, dy);
  }
  scale(sx: number, sy: number): void {
    this.skiaCanvas.scale(sx, sy);
  }
  rotate(deg: number, cx: number, cy: number): void {
    this.skiaCanvas.rotate(deg, cx, cy);
  }
  skew(sx: number, sy: number): void {
    this.skiaCanvas.skew(sx, sy);
  }
  setMatrix(matrix: Matrix): void {
    throw new Error("Method not implemented.");
  }
  concat(matrix: Matrix): void {
    throw new Error("Method not implemented.");
  }

  //builder
  makePath(): Path {
    return new CanvasKitPath(this);
  }
}

export class CanvasKitPath extends Path {
  skiaPath: CK.Path;
  get ck() {
    return this.render.canvasKit;
  }
  get cv() {
    return this.render.converter;
  }
  constructor(public render: CanvasKitRender) {
    super();
    this.skiaPath = new this.ck.Path();
  }
  delete(): void {
    this.skiaPath.delete();
  }
  offset(dx: number, dy: number): void {
    this.skiaPath.offset(dx, dy);
  }
  addArc(oval: Rect, startAngle: number, sweepAngle: number): void {
    this.skiaPath.addArc(this.cv.toSkiaRect(oval), startAngle, sweepAngle);
  }
  addCircle(x: number, y: number, radius: number): void {
    this.skiaPath.addCircle(x, y, radius);
  }
  addOval(oval: Rect): void {
    this.skiaPath.addOval(this.cv.toSkiaRect(oval));
  }
  addRect(rect: Rect): void {
    this.skiaPath.addRect(this.cv.toSkiaRect(rect));
  }
  addRRect(rrect: RRect): void {
    throw new Error("Method not implemented.");
  }
  close(): void {
    this.skiaPath.close();
  }
  copy(): Path {
    const path = new CanvasKitPath(this.render);
    path.skiaPath = this.skiaPath.copy();
    return path;
  }
  computeTightBounds(): Rect {
    const [l, t, r, b] = this.skiaPath.computeTightBounds();
    return new Rect(l, t, r, b);
  }
  contains(x: number, y: number): boolean {
    return this.skiaPath.contains(x, y);
  }
  getBounds(): Rect {
    const [l, t, r, b] = this.skiaPath.getBounds();
    return new Rect(l, t, r, b);
  }
  reset(): void {
    this.skiaPath.reset();
  }
  rewind(): void {
    this.skiaPath.rewind();
  }
  setFillType(fillType: FillType): void {
    this.skiaPath.setFillType(this.cv.toSkiaFillType(fillType));
  }
  getFillType(): FillType {
    switch (this.skiaPath.getFillType()) {
      case this.ck.FillType.EvenOdd:
        return FillType.EvenOdd;
      case this.ck.FillType.Winding:
        return FillType.Winding;
      default:
        throw new Error("Unknown FillType");
    }
  }
  simplify(): void {
    this.skiaPath.simplify();
  }
  moveTo(x: number, y: number): void {
    this.skiaPath.moveTo(x, y);
  }
  lineTo(x: number, y: number): void {
    this.skiaPath.lineTo(x, y);
  }
  quadTo(x1: number, y1: number, x2: number, y2: number): void {
    this.skiaPath.quadTo(x1, y1, x2, y2);
  }
  conicTo(x1: number, y1: number, x2: number, y2: number, w: number): void {
    this.skiaPath.conicTo(x1, y1, x2, y2, w);
  }
  cubicTo(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): void {
    this.skiaPath.cubicTo(x1, y1, x2, y2, x3, y3);
  }
}

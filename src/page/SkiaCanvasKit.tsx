"use client";

import AutoCanvas from "../components/AutoCanvas";
import { useEffect, useRef, useState } from "react";
import CanvasKitInit, { Canvas, CanvasKit, Font } from "canvaskit-wasm";
import React from "react";
type Ck = CanvasKit;
//create CanvasKit context
let isLoaded = false;
const CanvasKitContext = React.createContext<CanvasKit | undefined>(undefined);
export function CanvasKitProvider({ children }: { children: React.ReactNode }) {
  const [canvasKit, setCanvasKit] = useState<CanvasKit | undefined>(undefined);
  function loadCanvasKit() {
    CanvasKitInit({
      locateFile: (file) => "/node_modules/canvaskit-wasm/bin/" + file,
    }).then((_canvasKit) => {
      if (isLoaded) return;
      setCanvasKit(_canvasKit);
      console.log("CanvasKit loaded");
      isLoaded = true;
    });
  }
  useEffect(() => {
    loadCanvasKit();
    return () => {
      if (isLoaded) console.log("CanvasKit unloaded");
      setCanvasKit(undefined);
      isLoaded = false;
    };
  }, []);
  return (
    <CanvasKitContext.Provider value={canvasKit}>
      {canvasKit ? children : "Loading..."}
    </CanvasKitContext.Provider>
  );
}
export function useCanvasKit() {
  const canvasKit = React.useContext(CanvasKitContext);
  if (!canvasKit) {
    throw new Error("useCanvasKit must be used within a CanvasKitProvider");
  }
  return canvasKit;
}
async function loadGoogleFont(name: string) {
  var cdn = "https://storage.googleapis.com/skia-cdn/misc/";
  var fontData = await fetch(cdn + name);
  return fontData.arrayBuffer();
}

class ResourceManger {}
function SkiaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasKit = useCanvasKit();
  useEffect(() => {
    const canvasHtml = canvasRef.current!;
    const surface = canvasKit.MakeWebGLCanvasSurface(canvasHtml);
    const canvas = surface?.getCanvas()!!;
    const paint = new canvasKit.Paint();

    paint.setColor(canvasKit.Color(0, 0, 0, 1));
    canvas.drawRect(canvasKit.LTRBRect(0, 0, 100, 100), paint);
    paint.delete();
    skiaBasicDrawing(canvas, canvasKit).then(() => {
      surface!.flush();
      surface!.delete();
    });
  }, [canvasKit]);
  return <AutoCanvas canvasRef={canvasRef} />;
}
export default function SkiaCanvasKit() {
  return (
    <CanvasKitProvider>
      <div className="w-full h-full fixed">
        <SkiaCanvas />
      </div>
    </CanvasKitProvider>
  );
}
async function skiaTextDrawing(canvas: Canvas, ck: CanvasKit, font: Font) {}
async function skiaBasicDrawing(canvas: Canvas, ck: CanvasKit) {
  const path = new ck.Path();
  path.addCircle(100, 100, 50);
  const paint = new ck.Paint();
  paint.setAntiAlias(true);
  //paint style to fill
  paint.setStyle(ck.PaintStyle.Fill);

  paint.setColor(ck.Color(255, 0, 0, 1));
  canvas.drawPath(path, paint);

  canvas.drawPath(path, paint);

  //draw bezier curve
  {
    const path = new ck.Path();
    path.moveTo(200, 20);
    //add 10 point bezier curve
    path.cubicTo(230, 100, 290, 100, 320, 20);
    //more points
    path.cubicTo(350, 20, 410, 100, 440, 20);
    //more
    path.cubicTo(470, 100, 530, 100, 560, 20);

    //check point and path intersection
    const isIntersect = path.contains(100, 200);

    const paint = new ck.Paint();
    paint.setAntiAlias(true);
    paint.setStyle(ck.PaintStyle.Stroke);
    paint.setStrokeWidth(10);
    paint.setColor(ck.Color(0, 0, 255, 1));
    paint.setStrokeCap(ck.StrokeCap.Round);
    paint.setStrokeJoin(ck.StrokeJoin.Round);
    canvas.drawPath(path, paint);
  }
  //union of path example
  {
    const path1 = new ck.Path();
    path1.addCircle(200, 100, 50);
    const path2 = new ck.Path();
    path2.addRect(ck.LTRBRect(100, 100, 200, 200));
    const result = ck.Path.MakeFromOp(path1, path2, ck.PathOp.Union)!!;
    const paint = new ck.Paint();
    paint.setAntiAlias(true);
    paint.setStyle(ck.PaintStyle.Fill);
    paint.setColor(ck.Color(0, 0, 255, 1));
    canvas.drawPath(result, paint);
  }

  // {
  //   //draw text
  //   const fontArray = await loadGoogleFont("Roboto-Regular.ttf");
  //   // const fontMgr = ck.FontMgr.FromData(fontArray);
  //   const fontFace = ck.Typeface.MakeFreeTypeFaceFromData(fontArray);
  //   console.log(fontFace);
  //   const font = new ck.Font(fontFace, 20);
  //   const paint = new ck.Paint();
  //   paint.setAntiAlias(true);
  //   paint.setStyle(ck.PaintStyle.Fill);
  //   paint.setColor(ck.Color(0, 0, 255, 1));
  //   canvas.drawText("Hello Skia", 300, 100, paint, font);
  // }
  //text with path
  {
    //draw text
    const fontArray = await loadGoogleFont("Roboto-Regular.ttf");
    const fontFace = ck.Typeface.MakeFreeTypeFaceFromData(fontArray);
    const paint = new ck.Paint();
    const font = new ck.Font(fontFace, 16);

    //get text bounds

    paint.setAntiAlias(true);

    let glyphs = [];
    let positions = [];
    for (let i = 0; i < 1000; ++i) {
      glyphs.push(i);
      positions.push((i % 16) * 16);
      positions.push(Math.round(i / 16) * 16);
    }
    canvas.drawGlyphs(glyphs, positions, 16, 20, font, paint);
  }

  //paragraph
  {
    const fontArray = await loadGoogleFont("Roboto-Regular.ttf");
    const fontFace = ck.Typeface.MakeFreeTypeFaceFromData(fontArray);
    const font = new ck.Font(fontFace, 16);
    const paint = new ck.Paint();
    paint.setAntiAlias(true);
    paint.setStyle(ck.PaintStyle.Fill);
    paint.setColor(ck.Color(0, 0, 255, 1));
    console.log("metrics", font.getMetrics());
  }
}

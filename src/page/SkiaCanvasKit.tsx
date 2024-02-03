"use client";

import AutoCanvas from "../components/AutoCanvas";
import { useEffect, useRef, useState } from "react";
import InitCanvasKit, { CanvasKit } from "canvaskit-wasm";
import CanvasKitInit from "canvaskit-wasm";
import React from "react";

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

function SkiaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasKit = useCanvasKit();
  useEffect(() => {
    const canvas = canvasRef.current!;
    const surface = canvasKit.MakeWebGLCanvasSurface(canvas);
    const paint = new canvasKit.Paint();
    paint.setColor(canvasKit.Color(0, 0, 0, 1))
    surface!.getCanvas().drawRect(canvasKit.LTRBRect(0, 0, 100, 100), paint);
    paint.delete();
    surface!.flush();
    surface!.delete();
    
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
/**
const surface = canvasKit.MakeWebGLCanvasSurface(canvas);
const paint = new canvasKit.Paint();
paint.setColor(canvasKit.Color(0, 0, 0, 1));
surface!.getCanvas().drawRect(canvasKit.LTRBRect(0, 0, 100, 100), paint);
paint.delete();
surface!.flush();
surface!.delete();
console.log("CanvasKit", canvasKit);
 */

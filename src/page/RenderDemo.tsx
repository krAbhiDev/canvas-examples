"use client";

import AutoCanvas from "../components/AutoCanvas";
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import CanvasKitRender, { loadCanvasKit } from "../render/CanvasKitRender";
import CanvasKitLoader from "../render/CanvasKitLoader";
import { Point, Rect } from "../render/math";
import { Color, Render } from "../render/Render";

function RenderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderRef = useRef<Render | null>(null);

  useEffect(() => {
    const canvasHtml = canvasRef.current!;
    renderRef.current = new CanvasKitRender(canvasHtml);
    const render = renderRef.current!!;
    onDraw(render);

    // render.requestAnimationFrame(onDraw2)

    return () => {
      render.destroy();
    };
  }, []);
  function onDraw2() {
    onDraw(renderRef.current!!);

    renderRef.current!!.requestAnimationFrame(onDraw2);
  }
  function onDraw(render: Render) {
    // render.clear(Color.random())
    render.clear(Color.fromRGBA(240, 240, 240, 255));
    render.drawRect(Rect.fromCenter(100, 100, 100, 100), {
      color: Color.random(),
    });

    //draw n times random rectangles
    for (let i = 0; i < 3; i++) {
      render.drawRect(
        Rect.fromCenter(
          Math.random() * render.width,
          Math.random() * render.height,
          Math.random() * 50 + 20,
          Math.random() * 50 + 20
        ),
        {
          color: Color.random(),
        }
      );
    }
    //random circle
    render.drawCircle(new Point(100, 100), 50, {
      color: Color.random(),
      antiAlias: true,
    });

    //random oval
    render.drawOval(Rect.fromCenter(200, 200, 100, 50), {
      color: Color.random(),
    });

    //random line
    render.drawLine(new Point(100, 100), new Point(200, 200), {
      color: Color.random(),
    });
    //random arc
    render.drawArc(Rect.fromCenter(200, 200, 200, 50), 0, 90, {
      color: Color.random(),
    });

    //make path
    const path = render.makePath();
    path.moveTo(200, 100);
    path.lineTo(400, 200);
    path.quadTo(200, 300, 200, 200);
    path.lineTo(200, 200);
    path.lineTo(100, 300);
    path.cubicTo(100, 200, 300, 100, 400, 100);
    //curve
    // path.close();
    path.offset(200, 0);
    render.drawPath(path, {
      color: Color.random(),
    });
    path.delete();

    render.flush();
  }

  const moveCallback = useCallback(() => {
    onDraw(renderRef.current!!);
    console.log("Mouse moved");
  }, []);

  return (
    <AutoCanvas
      canvasRef={canvasRef}
      onResize={(width, height) => {
        renderRef.current!!.resize(width, height);
        console.log("Canvas resized", renderRef.current!!.height);
        onDraw(renderRef.current!!);
      }}
      onMouseMove={moveCallback}
    />
  );
}
export default function RenderDemo() {
  return (
    <div className="w-full h-full fixed p-4">
      <div className="w-full h-full">
        <CanvasKitLoader>
          <RenderCanvas />
        </CanvasKitLoader>
      </div>
    </div>
  );
}

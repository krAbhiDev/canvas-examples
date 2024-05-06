"use client";

import AutoCanvas from "../components/AutoCanvas";
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import CanvasKitRender from "../render/CanvasKitRender";
import CanvasKitLoader from "../render/CanvasKitLoader";
import { Point, Rect } from "../render/math";
import { Color, PathOp, Render } from "../render/Render";
import { randomEnum } from "../others/utils";

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

    //svg path
    const svgPath = render.makePathFromSVG(`
    M 10,30
       A 20,20 0,0,1 50,30
       A 20,20 0,0,1 90,30
       Q 90,60 50,90
       Q 10,60 10,30 z
    `);
    svgPath.offset(600, 200);
    render.drawPath(svgPath, {
      color: Color.random(),
    });

    svgPath.offset(100, 100);

    render.drawPath(svgPath, {
      color: Color.random(),
      style: "stroke",
      strokeWidth: 10,
      strokeJoin: "miter",
      strokeCap: "butt",
    });

    //path polyLine
    const polyPath = render.makePath();
    //v
    polyPath.addPolyline([
      new Point(100, 100),
      new Point(150, 150),
      new Point(200, 100),
    ])
    polyPath.offset(700, 100);

    render.drawPath(polyPath, {
      color: Color.random(),
      style: "stroke",
      strokeWidth: 10,
    });

    //path op example of circle and rect
    const circle = render.makePath();
    circle.addCircle(0, 0, 50);

    const rect = render.makePath();
    rect.addRect(new Rect(0, 0, 100, 100));

    const opPath=circle.copy();
    const op=randomEnum(PathOp);
    console.log({op})
    opPath.op(rect,op);
    opPath.offset(750, 150);

    render.drawPath(opPath, {
      color: Color.random(),
      style: "stroke",
      strokeWidth: 10,
    });
    
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
      <div className="w-full h-full  resize overflow-auto">
        <CanvasKitLoader>
          <RenderCanvas />
        </CanvasKitLoader>
      </div>
    </div>
  );
}

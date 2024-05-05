import {
  ForwardedRef,
  MutableRefObject,
  Ref,
  RefObject,
  forwardRef,
  useEffect,
  useRef,
} from "react";
interface MouseEvent2 extends MouseEvent {
  rx: number;
  ry: number;
}
interface AutoCanvasProps {
  canvasRef?: MutableRefObject<HTMLCanvasElement | null>;
  onResize?: (width: number, height: number) => void;
  onMouseMove?: (e: MouseEvent2) => void;
}
export default function AutoCanvas(props: AutoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (props.canvasRef) {
      props.canvasRef.current = canvasRef.current!!;
    }
    console.log("AutoCanvas effect called");
    const canvas = canvasRef.current!!;
    const parent = canvas.parentElement!;
    //get parent width and height
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const resizeCallback = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      if (props.onResize) {
        props.onResize(parent.clientWidth, parent.clientHeight);
      }
    };
    window.addEventListener("resize", resizeCallback);
    canvas.addEventListener("mousemove", (e) => {
      if (props.onMouseMove) {
        const e2 = e as MouseEvent2;
        const rect = canvas.getBoundingClientRect();
        e2.rx = e.clientX - rect.left;
        e2.ry = e.clientY - rect.top;
        props.onMouseMove(e2);
      }
    });
    return () => {
      window.removeEventListener("resize", resizeCallback);
    };
  }, []);
  return (
    <div className="canvas-wrapper">
      <canvas ref={canvasRef} className="auto-canvas"></canvas>
    </div>
  );
}

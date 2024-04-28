import { Color } from "../others/Color";
import { Render } from "../others/Render";
import { randomRange, toInt } from "../others/utils";
import { CircleShape } from "./Shape";
import { useEditorStore } from "./state";

export class Drawing {
  protected _canvas?: HTMLCanvasElement;
  protected _ctx?: CanvasRenderingContext2D;
  protected _render?: Render;
  protected _editorStateSub?: () => void;
  constructor(public canvasHolderDiv: HTMLDivElement) {
    this.createHTML();
  }
  get state() {
    return useEditorStore.getState();
  }

  private createHTML() {
    const canvas = document.createElement("canvas");
    canvas.className = " absolute top-0 left-0";
    this.canvasHolderDiv.appendChild(canvas);
    this._canvas = canvas;

    //handle canvas resize
    window.addEventListener("resize", () => {
      canvas.width = this.canvasHolderDiv.clientWidth - 2;
      canvas.height = this.canvasHolderDiv.clientHeight - 2;

      if (this._render) {
        this.redraw();
      }
    });
    canvas.width = this.canvasHolderDiv.clientWidth - 2;
    canvas.height = this.canvasHolderDiv.clientHeight - 2;
    //create context
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("cannot create canvas context");
    this._ctx = ctx;
    //create render
    const render = new Render(ctx);
    this._render = render;
    //draw full black rect
    this.redraw();
    //observer to state
    this._editorStateSub = useEditorStore.subscribe(() => {
      console.log("editor state changed");
      this.redraw();
    });
    canvas.addEventListener("mousemove", (e) => {
      useEditorStore.getState().updateShape(0, (shape) => {
        if (shape instanceof CircleShape) {
          shape.radius = e.clientX;
        }
      });
    });
  }
  clearHtml() {
    this.canvasHolderDiv.innerHTML = "";
    this._editorStateSub?.();
  }
  private addMouseListeners() {}

  protected onDraw() {
    if (!this._render) return;
    this._render.clear();
    for (const shape of this.state.shapes) {
      shape.draw(this._render);
      break;
    }

    //draw selected shape
  }
  redraw() {
    this.onDraw();
  }
}

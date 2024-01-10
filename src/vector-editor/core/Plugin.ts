import Point from "../../others/Point";
import { Render } from "../../others/Render";
import { Circle, Shape } from "./Shape";
import { Tool } from "./Tool";
import VectorEditor from "./VectorEditor";
import {
  BaseEventType,
  EditorKeyEvent,
  EditorMouseEvent,
  EditorProperties,
  EditorWheelEvent,
} from "./common";
export type PluginEventType = BaseEventType | "onActivate" | "onDeActivate";

export class Plugin {
  private _editor?: VectorEditor;
  get editor() {
    if (!this._editor) throw new Error("Editor is not activated");
    return this._editor;
  }

  sendMessage(type: PluginEventType, ...args: any) {
    this.onMessage(type, ...args);
  }

  redraw() {
    this.editor.redraw();
  }
  capturePointer(e: EditorMouseEvent) {
    this.editor.capturePointer(e);
  }
  releasePointer(e: EditorMouseEvent) {
    this.editor.releasePointer(e);
  }
  get properties(): EditorProperties {
    return this.editor.properties;
  }
  set properties(properties: Partial<EditorProperties>) {
    this.editor.properties = properties;
  }

  //callbacks
  protected onMessage(type: PluginEventType, ...args: any) {
    switch (type) {
      case "onActivate":
        console.log(type, args);
        this._editor = args[0];
        this.onActivate(args[0]);
        break;
      case "onDeActivate":
        this.onDeActivate();
        break;
      case "onDraw":
        this.onDraw(args[0]);
        break;
      case "onPreDraw":
        this.onPreDraw(args[0]);
        break;
      case "onPostDraw":
        this.onPostDraw(args[0]);
        break;
      case "onSelectedShapeChange":
        this.onSelectedShapeChange(args[0]);
        break;
      case "onSelectedToolChange":
        this.onSelectedToolChange(args[0]);
        break;

      case "onMouseDown":
        this.onMouseDown(args[0]);
        break;
      case "onMouseMove":
        this.onMouseMove(args[0]);
        break;
      case "onMouseUp":
        this.onMouseUp(args[0]);
        break;
      case "onMouseLeave":
        this.onMouseLeave(args[0]);
        break;
      case "onMouseEnter":
        this.onMouseEnter(args[0]);
        break;
      case "onMouseWheel":
        this.onMouseWheel(args[0]);
        break;
      case "onKeyDown":
        this.onKeyDown(args[0]);
        break;
      case "onKeyUp":
        this.onKeyUp(args[0]);
        break;
      case "onKeyPress":
        this.onKeyPress(args[0]);
        break;
      case "onMouseDragStart":
        this.onMouseDragStart(args[0]);
        break;
      case "onMouseDrag":
        this.onMouseDrag(args[0]);
        break;
      case "onMouseDragEnd":
        this.onMouseDragEnd(args[0]);
        break;
      case "onSelectedShapeChange":
        this.onSelectedShapeChange(args[0]);
        break;
      case "onSelectedToolChange":
        this.onSelectedToolChange(args[0]);
        break;
    }
  }

  protected onActivate(editor: VectorEditor) {}
  protected onDeActivate() {}

  //draw
  protected onPreDraw(render: Render) {}
  protected onDraw(render: Render) {}
  protected onPostDraw(render: Render) {}

  //shape & tools
  protected onSelectedShapeChange(shape?: Shape) {}
  protected onSelectedToolChange(tool?: Tool) {}

  //mouse event
  protected onMouseDown(e: EditorMouseEvent) {}
  protected onMouseMove(e: EditorMouseEvent) {}
  protected onMouseUp(e: EditorMouseEvent) {}
  protected onMouseLeave(e: EditorMouseEvent) {}
  protected onMouseEnter(e: EditorMouseEvent) {}
  protected onMouseWheel(e: EditorWheelEvent) {}
  //keyEvent
  protected onKeyDown(e: EditorKeyEvent) {}
  protected onKeyUp(e: EditorKeyEvent) {}
  protected onKeyPress(e: EditorKeyEvent) {}
  //mouse drag event
  protected onMouseDragStart(e: EditorMouseEvent) {}
  protected onMouseDrag(e: EditorMouseEvent) {}
  protected onMouseDragEnd(e: EditorMouseEvent) {}
}
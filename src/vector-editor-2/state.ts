import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { CircleShape, RectShape, Shape } from "./Shape";
import { immer } from "zustand/middleware/immer";
import Point from "../others/Point";
import { randomRange, setTimer } from "../others/utils";
import { Color } from "../others/Color";

export interface EditorState {
  shapes: Shape[];
  selectedShapeId?: number;
  setSelectedShapeId: (id?: number) => void;
  addShape: (shape: Shape) => void;
  removeShape: (shape: Shape) => void;
  clearShapes: () => void;
  removeShapeAt: (index: number) => void;
  updateShape: (id: number, callback: (shape: Shape) => void) => void;
  getShapeById: (id?: number) => Shape | undefined;
  getSelectedShape: () => Shape | undefined;
}

export const useEditorStore = create<EditorState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      shapes: [],
      selectedShapeId: undefined,
      setSelectedShapeId: (id) => set({ selectedShapeId: id }),
      addShape: (shape) =>
        set((state) => {
          state.shapes.push(shape);
        }),
      removeShape: (shape) =>
        set((state) => {
          const index = state.shapes.findIndex((s) => s.id === shape.id);
          if (index === -1) return;
          state.shapes.splice(index, 1);
          if (state.selectedShapeId === shape.id)
            state.selectedShapeId = undefined;
        }),
      clearShapes: () => {
        set((state) => {
          state.shapes = [];
          state.selectedShapeId = undefined;
        });
      },
      removeShapeAt: (index) =>
        set((state) => {
          state.shapes.splice(index, 1);
          if (state.selectedShapeId === state.shapes[index].id)
            state.selectedShapeId = undefined;
        }),
      updateShape: (id, callback) => {
        set((state) => {
          const shape = state.shapes.find((s) => s.id === id);
          if (!shape) return;
          callback(shape as Shape);
        });
      },
      getShapeById: (id?: number) => get().shapes.find((s) => s.id === id),
      getSelectedShape: () => get().getShapeById(get().selectedShapeId),
    }))
  )
);

{
  const shape = new CircleShape();
  shape.center.set(100, 100);
  shape.radius = 50;
  useEditorStore.getState().addShape(shape);

  setInterval(() => {
    // const newShape = useEditorStore.getState().getShapeById(shape.id)!!;
    // newShape.center.x++;
    // useEditorStore.getState().updateShape(newShape);
    // console.log("shape.center.x", newShape.center.x);
    // useEditorStore.getState().updateShape(shape.id, (shape) => {
    //   shape.center.x++;
    // });
  }, 100);
}
{
  const shape = new CircleShape();
  shape.center.set(300, 200);
  shape.radius = 50;
  shape.color.colorString = "red";
  useEditorStore.getState().addShape(shape);
}

// setInterval(() => {
//   const isEven = useEditorStore.getState().shapes.length % 2 === 0;
//   if (isEven) {
//     const shape = new CircleShape();
//     shape.center.set(randomRange(0, 700), randomRange(0, 300));
//     shape.radius = 50;
//     shape.color = Color.random();
//     useEditorStore.getState().addShape(shape);
//   } else {
//     const shape = new RectShape();
//     shape.center.set(randomRange(0, 700), randomRange(0, 300));
//     shape.width = 50;
//     shape.height = 50;
//     shape.color = Color.random();
//     useEditorStore.getState().addShape(shape);
//   }
// }, 1000);

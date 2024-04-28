import { Fragment, useEffect } from "react";
import { VectorEditorProvider, useVectorEditor } from "./Context";

export function PanelA({ children }: { children: React.ReactNode }) {
  const state = useVectorEditor();
  useEffect(() => {
    state.setEditorState((prev) => {
      return { ...prev, panelANodes: [...prev.panelANodes, children] };
    });
    //remove on unmouted
    return () => {
      state.setEditorState((prev) => {
        return {
          ...prev,
          panelANodes: prev.panelANodes.filter((node) => node !== children),
        };
      });
    };
  }, [children]);
  return <></>;
}
export function PanelB() {}
export function PanelC() {}
//with children

//--------hooks
type MouseCallback = (x: number, y: number) => void;
function onMouseMove(callback:MouseCallback) {

}

export default function VectorEditor({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <VectorEditorProvider>
      {children}
      <App />
    </VectorEditorProvider>
  );
}
function App() {
  const editorState = useVectorEditor();
  return (
    <div className="flex w-screen h-screen absolute left-0 top-0 ">
      <div className="bg-red-200 flex-1">
        {editorState.panelANodes.map((node, i) => (
          <Fragment key={i}>{node}</Fragment>
        ))}
      </div>
      <div className="bg-green-200 flex-1">
        {editorState.panelBNodes.map((node, i) => (
          <Fragment key={i}>{node}</Fragment>
        ))}
      </div>
      <div className="bg-blue-200 flex-1">
        {editorState.panelCNodes.map((node, i) => (
          <Fragment key={i}>{node}</Fragment>
        ))}
        <h1>a</h1>
        <h1>a2</h1>
        <h1>a23</h1>
      </div>
    </div>
  );
}

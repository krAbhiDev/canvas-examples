/**vector editor context
 * use to store the state of the vector editor
 * **/
import React, { createContext, useContext, useReducer, useState } from "react";

type VectorEditorContextState = {
  panelANodes: React.ReactNode[];
  panelBNodes: React.ReactNode[];
  panelCNodes: React.ReactNode[];
};
type VectorEditorContextType = {
  setEditorState: React.Dispatch<
    React.SetStateAction<VectorEditorContextState>
  >;
} & VectorEditorContextState;

const VectorEditorContext = createContext<VectorEditorContextType | undefined>(
  undefined
);

export const useVectorEditor = () => {
  const context = useContext(VectorEditorContext);
  if (!context) {
    throw new Error(
      "useVectorEditor must be used within a VectorEditorProvider"
    );
  }
  return context;
};

export function VectorEditorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [editorState, setEditorState] = useState<VectorEditorContextState>({
    panelANodes: [],
    panelBNodes: [],
    panelCNodes: [],
  });
  return (
    <VectorEditorContext.Provider value={{ ...editorState, setEditorState }}>
      {children}
    </VectorEditorContext.Provider>
  );
}

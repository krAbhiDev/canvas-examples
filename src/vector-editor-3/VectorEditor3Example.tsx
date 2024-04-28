import { useEffect, useState } from "react";
import VectorEditor, { PanelA } from "./VectorEditor";

function PluginA() {
  const [ids, setIds] = useState<number[]>([]);
  useEffect(() => {
    const timer = setInterval(() => {
      setIds((prev) => [...prev, prev.length + 1]);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <>
      <PanelA>
        {ids.map((id) => (
          <div key={id}>PluginA {id}</div>
        ))}
      </PanelA>
    </>
  );
}
export default function VectorEditor3Example() {
  return (
    <div>
      <VectorEditor>
        <PluginA />
      </VectorEditor>
    </div>
  );
}

//how to create something like  <VectorEditor.PanelA/>

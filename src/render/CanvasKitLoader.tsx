import React, { useEffect } from "react";
import { useState } from "react";
import { loadCanvasKit } from "./CanvasKitRender";

export default function CanvasKitLoader({
  children,
  loader,
}: {
  children: React.ReactNode;
  loader?: () => React.ReactNode;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    loadCanvasKit().then((e) => {
      setIsLoaded(true);
    });
  }, []);

  return isLoaded ? <>{children}</> : loader ? loader() : <div>Loading...</div>;
}

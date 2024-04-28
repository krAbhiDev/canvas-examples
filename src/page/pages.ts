import React from "react"
import PanZoom from "./PanZoom"
import PaperDemo from "./PaperDemo"
import ConvexHull from "./ConvexHull"
import MathEval from "./MathEval"
import Triangulation from "./Triangulation"
import ObjectEditor from "./ObjectEditor"
import VectorApp from "../vector-editor/VectorApp"
import SkiaCanvasKit from "./SkiaCanvasKit"
import VectorEditor2 from "../vector-editor-2/VectorEditor2"
import VectorEditor3Example from "../vector-editor-3/VectorEditor3Example"

type PageItem = {
    name: string
    component: () => React.JSX.Element
}
const pages: PageItem[] = [
    { name: "pan-zoom", component: PanZoom },
    { name: "paper-demo", component: PaperDemo },
    { name: "convex-hull", component: ConvexHull },
    { name: "math-eval", component: MathEval },
    { name: "triangulation", component: Triangulation },
    { name: "object-editor", component: ObjectEditor },
    { name: "vector-app", component: VectorApp },
    { name: "skia-canvas", component: SkiaCanvasKit },
    { name: "vector-app-2", component: VectorEditor2 },
    { name: "vector-app-3", component: VectorEditor3Example },


]

export default pages
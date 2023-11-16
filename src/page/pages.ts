import React from "react"
import PanZoom from "./PanZoom"
import PaperDemo from "./PaperDemo"
import ConvexHull from "./ConvexHull"
import MathEval from "./MathEval"
import VectorApp from "./VectorApp"

type PageItem = {
    name: string
    component: () => React.JSX.Element
}
const pages: PageItem[] = [
    { name: "pan-zoom", component: PanZoom },
    { name: "paper-demo", component: PaperDemo },
    { name: "convex-hull", component: ConvexHull },
    { name: "math-eval", component: MathEval },
    { name: "vector-app", component: VectorApp },
]

export default pages
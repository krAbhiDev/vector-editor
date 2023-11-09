import React from "react"
import PanZoom from "./PanZoom"
import PaperDemo from "./PaperDemo"

type PageItem = {
    name: string
    component: () => React.JSX.Element
}
const pages: PageItem[] = [
    { name: "pan-zoom", component: PanZoom },
    { name: "paper-demo", component: PaperDemo },
]

export default pages
import { Panel } from "../Panel";

export class PropertyPanel extends Panel {
  constructor() {
    super();
    this.createHTML();
  }
  protected override createHTML() {
    const htmlDiv = document.createElement("div");
    htmlDiv.className = "bg-green-200 w-[200px] p-1 flex flex-col gap-1";
    this.htmlDiv = htmlDiv;
  }
}

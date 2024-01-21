import { setTimer } from "../../others/utils";
import { CircleShape } from "./Shape";
import { Observer } from "./Observer";
import { Plugin } from "./Plugin";
import EditorStateAndEvent from "./EditorStateAndEvent";
//remove plugin from PluginInfo
export type EditorPluginInfo = {
  plugin: Plugin;
  name: string;
  order: number;
};
export default class VectorEditor extends EditorStateAndEvent {
 
  constructor(private main: HTMLDivElement) {
    super();
    this.createHTML();
    this.onStart();
    this.addListeners();
  }
  onStart(): void {
    this.editorPanel.onStart();
    this.toolPanel.onStart();
    this.propertyPanel.onStart();
  }
  protected override createHTML() {
    const htmlDiv = document.createElement("div");
    htmlDiv.className = "bg-red-50 w-full h-full flex flex-row";
    this.htmlDiv = htmlDiv;

    //add editor panel and tool panel
    {
      const div = document.createElement("div");
      div.className = "bg-green-200 flex-1 relative";
      // console.log(this.toolPanel.html(), this.editorPanel.html());
      div.appendChild(this.toolPanel.html()!!);
      div.appendChild(this.editorPanel.html()!!);
      this.htmlDiv.appendChild(div);
    }
    //add property panel
    this.htmlDiv.appendChild(this.propertyPanel.html()!!);

    //main
    this.main.appendChild(this.htmlDiv);
  }
}

import { setTimer } from "../../../others/utils";
import { Panel } from "../Panel";
import { Tool } from "../Tool";
import VectorEditor from "../VectorEditor";
import EditorStateAndEvent from "../EditorStateAndEvent";

export class ToolPanel extends Panel {
  constructor(private editor: EditorStateAndEvent) {
    super();
    this.createHTML();
  }
  protected override createHTML() {
    const htmlDiv = document.createElement("div");
    htmlDiv.className =
      "h-[40px] text-xs bg-gray-50 shadow-md z-50 absolute top-3 left-1/2 -translate-x-1/2 flex flex-row cursor-default  flex ";
    this.htmlDiv = htmlDiv;
  }
  addTool(tool: Tool) {
    const toolDiv = document.createElement("div");
    toolDiv.className =
      "h-full hover:bg-red-100 p-1 flex items-center select-none  ";
    toolDiv.addEventListener("click", () => {
      this.editor.selectedTool = tool;
      this.editor.tools.forEach((_tool) => {
        if (_tool == this.editor.selectedTool) {
          _tool.div?.classList.add("!bg-orange-200");
        } else {
          _tool.div?.classList.remove("!bg-orange-200");
        }
      });
    });
    toolDiv.innerHTML = tool.name;
    tool.div = toolDiv;
    this.htmlDiv?.appendChild(toolDiv);
    this.editor.tools.push(tool);
  }
  removeTool(tool: Tool) {
    this.htmlDiv?.removeChild(tool.div!!);
    this.editor.tools = this.editor.tools.filter((_tool) => _tool != tool);
    if (this.editor.selectedTool == tool) this.editor.selectedTool = undefined;
  }
}

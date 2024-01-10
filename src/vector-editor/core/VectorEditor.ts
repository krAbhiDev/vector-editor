import { Render } from "../../others/Render";
import { setTimer } from "../../others/utils";
import { Circle, Shape } from "./Shape";
import { Observer } from "./Observer";
import { Plugin } from "./Plugin";
import { Tool } from "./Tool";
import { Panel } from "./Panel";
import { PropertyPanel } from "./panels/PropertyPanel";
import { EditorPanel } from "./panels/EditorPanel";
import { ToolPanel } from "./panels/ToolPanel";
import { BaseEventType } from "./common";

export abstract class EditorStateAndEvent extends Panel {
  protected _plugins: Map<string, Plugin> = new Map();
  protected _shapes: Shape[] = [];
  protected _tools: Tool[] = [];
  protected _selectedTool?: Tool = undefined;
  protected _selectedShape?: Shape = undefined;
  //panels
  protected editorPanel = new EditorPanel();
  protected toolPanel = new ToolPanel(this);
  protected propertyPanel = new PropertyPanel();

  get render() {
    return this.editorPanel.render;
  }
  get shapes() {
    return this._shapes;
  }
  get selectedShape() {
    return this._selectedShape;
  }
  get selectedTool() {
    return this._selectedTool;
  }
  get tools() {
    return this._tools;
  }
  set tools(tools: Tool[]) {
    this._tools = tools;
  }

  set selectedTool(tool: Tool | undefined) {
    if (this._selectedTool == tool) return;
    this._selectedTool = tool;
    this.onSelectedToolChange(tool);
  }
  set selectedShape(shape: Shape | undefined) {
    this._selectedShape = shape;
    this.onSelectedShapeChange(shape);
  }
  addShape(shape: Shape) {
    this._shapes.push(shape);
    this.redraw();
  }
  removeShape(shape: Shape) {
    const index = this._shapes.indexOf(shape);
    if (index !== -1) {
      this._shapes.splice(index, 1);
      this.redraw();
    }
  }
  //tool
  addTool(tool: Tool) {
    this.toolPanel.addTool(tool);
  }
  //remove tool
  removeTool(tool: Tool) {
    this.toolPanel.removeTool(tool);
  }

  //events
  protected onMouseDown(e: PointerEvent) {}
  protected onMouseMove(e: PointerEvent) {}
  protected onMouseUp(e: PointerEvent) {}
  protected onMouseLeave(e: PointerEvent) {}
  protected onMouseEnter(e: PointerEvent) {}
  protected onMouseWheel(e: WheelEvent) {}
  protected onClick(e: MouseEvent) {}
  //keyEvent
  protected onKeyDown(e: KeyboardEvent) {}
  protected onKeyUp(e: KeyboardEvent) {}
  protected onKeyPress(e: KeyboardEvent) {}
  //mouse drag event
  protected onMouseDragStart(e: PointerEvent) {}
  protected onMouseDrag(e: PointerEvent) {}
  protected onMouseDragEnd(e: PointerEvent) {}

  //draw
  protected onPreDraw(render: Render) {}
  protected onDraw(render: Render) {}
  protected onPostDraw(render: Render) {}
  redraw() {
    this.onPreDraw(this.render);
    this.onDraw(this.render);
    this.onPostDraw(this.render);
  }
  //callback
  protected onSelectedShapeChange(shape?: Shape) {

  }
  protected onSelectedToolChange(tool?: Tool) {
    //send to all plugins
    this._plugins.forEach((plugin) => {
      plugin.sendMessage("onSelectedToolChange", tool);
    });
  }
  protected onInitProperty(shape: Shape) {}
  protected onMessage(type: BaseEventType, ...args: any) {
    switch (type) {
      case "onMouseDown":
        this.onMouseDown(args[0]);
        break;
      case "onMouseMove":
        this.onMouseMove(args[0]);
        break;
      case "onMouseUp":
        this.onMouseUp(args[0]);
        break;
      case "onMouseLeave":
        this.onMouseLeave(args[0]);
        break;
      case "onMouseEnter":
        this.onMouseEnter(args[0]);
        break;
      case "onMouseWheel":
        this.onMouseWheel(args[0]);
        break;
      case "onClick":
        this.onClick(args[0]);
        break;
      case "onKeyDown":
        this.onKeyDown(args[0]);
        break;
      case "onKeyUp":
        this.onKeyUp(args[0]);
        break;
      case "onKeyPress":
        this.onKeyPress(args[0]);
        break;
      case "onMouseDragStart":
        this.onMouseDragStart(args[0]);
        break;
      case "onMouseDrag":
        this.onMouseDrag(args[0]);
        break;
      case "onMouseDragEnd":
        this.onMouseDragEnd(args[0]);
        break;
      case "onSelectedShapeChange":
        this.onSelectedShapeChange(args[0]);
        break;
      case "onSelectedToolChange":
        this.onSelectedToolChange(args[0]);
        break;
      case "onInitProperty":
        this.onInitProperty(args[0]);
        break;
    }
  }
  sendMessage(type: BaseEventType, ...args: any) {
    this.onMessage(type, args);
  }
}

export default class VectorEditor extends EditorStateAndEvent {
  constructor(private main: HTMLDivElement) {
    super();
    this.createHTML();
    this.onStart();
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
  //add shape

  addTool(tool: Tool) {}
  addPlugin(plugin: Plugin, name: string) {
    if (this._plugins.has(name)) {
      console.error(`Plugin with name: ${name} already exists`);
      return;
    }
    this._plugins.set(name, plugin);
    plugin.sendMessage("onActivate", this);
    console.log(`Plugin with name: ${name} added`);
  }
  removePlugin(name: string) {
    const plugin = this._plugins.get(name);
    if (plugin) {
      plugin.sendMessage("onDeActivate");
      this._plugins.delete(name);
      console.log(`Plugin with name: ${name} removed`);
    } else {
      console.error(`Plugin with name: ${name} does not exist`);
    }
  }

  //draw
  protected override onPreDraw(render: Render) {
    this._plugins.forEach((plugin) => {
      plugin.sendMessage("onPreDraw", render);
    });
  }
  protected override onDraw(render: Render) {
    this._plugins.forEach((plugin) => {
      plugin.sendMessage("onDraw", render);
    });
  }
  protected override onPostDraw(render: Render) {
    this._plugins.forEach((plugin) => {
      plugin.sendMessage("onPostDraw", render);
    });
  }
}

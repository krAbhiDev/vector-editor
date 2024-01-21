import { Render } from "../../others/Render";
import { Shape } from "./Shape";
import { Tool } from "./Tool";
import { Panel } from "./Panel";
import { PropertyPanel } from "./panels/PropertyPanel";
import { EditorPanel } from "./panels/EditorPanel";
import { ToolPanel } from "./panels/ToolPanel";
import {
  BaseEventType,
  EditorKeyEvent,
  EditorMouseEvent,
  EditorProperties,
  EditorWheelEvent,
  PluginInfo,
} from "./common";
import { Color } from "../../others/Color";
import Point from "../../others/Point";
import { EditorPluginInfo } from "./VectorEditor";

export default abstract class EditorStateAndEvent extends Panel {
  protected _pluginsInfo = Array<EditorPluginInfo>();

  protected _shapes: Shape[] = [];
  protected _tools: Tool[] = [];
  protected _selectedTool?: Tool = undefined;
  protected _selectedShape?: Shape = undefined;

  //panels
  protected editorPanel = new EditorPanel();
  protected toolPanel = new ToolPanel(this);
  protected propertyPanel = new PropertyPanel();

  //document
  protected _properties: EditorProperties = {
    documentWidth: 500,
    documentHeight: 500,
    backgroundColor: Color.fromHex("#eeaaee"),
    zoom: 1,
    maxZoom: 8,
    minZoom: 0.001,
    grid: false,
    gridColor: Color.fromHex("#000000"),
    isDragging: false,
    panOffset: new Point(),
  };
  protected _button = 0;
  //private for utils
  private _downPoint = new Point();
  protected isMouseCaptured = false;
  get properties(): EditorProperties {
    return this._properties;
  }
  set properties(properties: Partial<EditorProperties>) {
    this._properties = { ...this._properties, ...properties };
    this.redraw();
  }

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
    this.sendMessage("onSelectedToolChange", tool);
  }
  set selectedShape(shape: Shape | undefined) {
    if (this._selectedShape == shape) return;
    this._selectedShape = shape;
    this.sendMessage("onSelectedShapeChange", shape);
  }
  addShape(shape: Shape) {
    this._shapes.push(shape);
    this.redraw();
  }
  removeShape(shape: Shape) {
    const index = this._shapes.indexOf(shape);
    if (index !== -1) {
      this._shapes.splice(index, 1);
      if (this.selectedShape == shape) {
        this.sendMessage("onSelectedShapeChange", undefined);
        this.selectedShape = undefined;
      }
      this.redraw();
    }
  }
  removeShapeFromIndex(index: number) {
    if (index < 0 || index >= this._shapes.length) return;
    const shape = this._shapes[index];
    this._shapes.splice(index, 1);
    if (this.selectedShape == shape) {
      this.sendMessage("onSelectedShapeChange", undefined);
      this.selectedShape = undefined;
    }
    this.redraw();
  }
  //tool
  addTool(tool: Tool) {
    this.toolPanel.addTool(tool);
  }
  //remove tool
  removeTool(tool: Tool) {
    this.toolPanel.removeTool(tool);
  }

  //plugins
  addPlugin(pluginInfo: PluginInfo) {
    // if (this._plugins.has(name)) {
    //   console.error(`Plugin with name: ${name} already exists`);
    //   return;
    // }
    // this._plugins.set(name, plugin);
    // plugin.sendMessage("onActivate", this);
    // console.log(`Plugin with name: ${name} added`);
    //check if plugin with same name exist or not
    const plugin = this._pluginsInfo.find((p) => p.name == pluginInfo.name);
    if (plugin) {
      console.error(`Plugin with name: ${pluginInfo.name} already exists`);
      return;
    }
    const editorPluginInfo: EditorPluginInfo = {
      plugin: new pluginInfo.pluginType(),
      name: pluginInfo.name,
      order: pluginInfo.order || 0,
    };
    editorPluginInfo.plugin.name = pluginInfo.name;
    this._pluginsInfo.push(editorPluginInfo);
    //sort plugins by order
    this.sortPlugins();
    //activate plugin
    editorPluginInfo.plugin.sendMessage("onActivate", this);
  }
  private sortPlugins() {
    this._pluginsInfo.sort(({ order: o1 = 0 }, { order: o2 = 0 }) => {
      return o1 - o2;
    });
  }
  removePlugin(name: string) {
    const plugin = this._pluginsInfo.find((p) => p.name == name);
    if (plugin) {
      plugin.plugin.sendMessage("onDeActivate");
      const index = this._pluginsInfo.indexOf(plugin);
      if (index !== -1) {
        this._pluginsInfo.splice(index, 1);
      }
    } else {
      console.error(`Plugin with name: ${name} does not exist`);
    }
  }

  //events
  protected onMouseDown(e: EditorMouseEvent) {}
  protected onMouseMove(e: EditorMouseEvent) {}
  protected onMouseUp(e: EditorMouseEvent) {}
  protected onMouseLeave(e: EditorMouseEvent) {}
  protected onMouseEnter(e: EditorMouseEvent) {}
  protected onMouseWheel(e: WheelEvent) {}
  protected onClick(e: MouseEvent) {}
  //keyEvent
  protected onKeyDown(e: EditorKeyEvent) {}
  protected onKeyUp(e: EditorKeyEvent) {}
  protected onKeyPress(e: EditorKeyEvent) {}
  //mouse drag event
  protected onMouseDragStart(e: EditorMouseEvent) {}
  protected onMouseDrag(e: EditorMouseEvent) {}
  protected onMouseDragEnd(e: EditorMouseEvent) {}

  //draw
  protected onPreDraw(render: Render) {}
  protected onDraw(render: Render) {}
  protected onPostDraw(render: Render) {}
  redraw() {
    this.render.clear();
    this.sendMessage("onPreDraw", this.render);
    this.sendMessage("onDraw", this.render);
    this.sendMessage("onPostDraw", this.render);
  }
  //callback
  protected onSelectedShapeChange(shape?: Shape) {}
  protected onSelectedToolChange(tool?: Tool) {}
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
    this.onMessage(type, ...args);
    //send message to all plugins
    this._pluginsInfo.forEach((info) => {
      info.plugin.sendMessage(type, ...args);
    });
  }

  // listeners for mouse to canvas
  protected addMouseListeners() {
    const canvas = this.editorPanel.canvas;
    const makeEditorMouseEvent = (e: PointerEvent): EditorMouseEvent => {
      const rect = canvas.getBoundingClientRect();

      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        pe: e,
        sp: new Point(e.clientX - rect.left, e.clientY - rect.top),
        wp: this.screenToWorld(
          new Point(e.clientX - rect.left, e.clientY - rect.top)
        ),
        button: this._button,
      };
    };
    const makeEditorWheelEvent = (e: WheelEvent): EditorWheelEvent => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        we: e,
        direction: e.deltaY > 0 ? "down" : "up",
      };
    };
    canvas.addEventListener("pointerdown", (e) => {
      this._button = e.buttons;
      const mEvent = makeEditorMouseEvent(e);
      this._downPoint = mEvent.sp.clone();

      this.sendMessage("onMouseDown", mEvent);
    });
    canvas.addEventListener("pointermove", (e) => {
      const mEvent = makeEditorMouseEvent(e);
      this.sendMessage("onMouseMove", mEvent);

      if (this.properties.isDragging) {
        this.sendMessage("onMouseDrag", mEvent);
      }
      const length = mEvent.sp.clone().sub(this._downPoint).length();
      if (!this.properties.isDragging && length > 5 && this.isMouseCaptured) {
        this.properties.isDragging = true;
        this.sendMessage("onMouseDragStart", mEvent);
      }
    });
    canvas.addEventListener("pointerup", (e) => {
      const mEvent = makeEditorMouseEvent(e);
      this.sendMessage("onMouseUp", mEvent);
      if (this.properties.isDragging) {
        this.properties.isDragging = false;
        this.sendMessage("onMouseDragEnd", mEvent);
      }
    });
    canvas.addEventListener("pointerleave", (e) => {
      const mEvent = makeEditorMouseEvent(e);
      this.sendMessage("onMouseLeave", mEvent);
    });
    canvas.addEventListener("pointerenter", (e) => {
      const mEvent = makeEditorMouseEvent(e);
      this.sendMessage("onMouseEnter", mEvent);
    });

    //wheel
    canvas.addEventListener("wheel", (e) => {
      const mEvent = makeEditorWheelEvent(e);
      this.sendMessage("onMouseWheel", mEvent);
    });

    //disable contextmenu
    canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }
  protected addKeyListeners() {
    const makeEditorKeyEvent = (e: KeyboardEvent): EditorKeyEvent => {
      return {
        ke: e,
      };
    };
    window.addEventListener("keydown", (e) => {
      const mEvent = makeEditorKeyEvent(e);
      this.sendMessage("onKeyDown", mEvent);
    });
    window.addEventListener("keyup", (e) => {
      const mEvent = makeEditorKeyEvent(e);
      this.sendMessage("onKeyUp", mEvent);
    });
    window.addEventListener("keypress", (e) => {
      const mEvent = makeEditorKeyEvent(e);
      this.sendMessage("onKeyPress", mEvent);
    });
  }
  protected addListeners() {
    window.addEventListener("resize", () => {
      this.redraw();
    });
    this.addMouseListeners();
    this.addKeyListeners();
  }

  //capture mouse
  capturePointer(e: EditorMouseEvent) {
    this.editorPanel.canvas.setPointerCapture(e.pe.pointerId);
    this.isMouseCaptured = true;
  }
  releasePointer(e: EditorMouseEvent) {
    this.editorPanel.canvas.releasePointerCapture(e.pe.pointerId);
    this.isMouseCaptured = false;
  }

  //conversion utils for point
  screenToWorld(screen: Point) {
    const offset = this.properties.panOffset;
    const currentZoom = this.properties.zoom;
    const worldX = (screen.x - offset.x) / currentZoom;
    const worldY = (screen.y - offset.y) / currentZoom;
    return new Point(worldX, worldY);
  }
  worldToScreen(world: Point) {
    const offset = this.properties.panOffset;
    const currentZoom = this.properties.zoom;
    const screenX = world.x * currentZoom + offset.x;
    const screenY = world.y * currentZoom + offset.y;
    return new Point(screenX, screenY);
  }
}

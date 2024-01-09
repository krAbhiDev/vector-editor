import { Render } from "../others/Render";
import { setTimer } from "../others/utils";
export type PropertyType = "number" | "string" | "boolean" | "color";
class Observer<T> {
  private _isDead = false;
  constructor(public callback: (value: T) => void) {}
  remove() {
    this._isDead = true;
  }
  get isDead() {
    return this._isDead;
  }
}
export class Property<T> {
  protected _value: T;
  protected _type: PropertyType;
  protected _name: string;
  protected observers: Observer<T>[] = [];
  constructor(value: T, type: PropertyType, name: string) {
    this._value = value;
    this._type = type;
    this._name = name;
  }
  get value(): T {
    return this._value;
  }
  get type(): PropertyType {
    return this._type;
  }
  get name(): string {
    return this._name;
  }
  set value(value: T) {
    if (value === this._value) return;
    this._value = value;
    this.observers.forEach((observer) => {
      observer.callback(value);
    });
  }
  addObserver(callback: (value: T) => void) {
    const observer = new Observer(callback);
    this.observers.push(observer);
    console.log("observer added");
    return observer;
  }
  removeObserver(observer: Observer<T>) {
    observer.remove();
    this.removeDeadObservers();
  }
  removeDeadObservers() {
    this.observers = this.observers.filter((observer) => {
      console.log("observer removed");
      return !observer.isDead;
    });
  }
}
export class ArrayProperty<T> extends Property<T> {}
export class Shape {
  x = new Property(0, "number", "x");
  y = new Property(0, "number", "y");
  colors = new Property(["#000000"], "color", "colors");
  color = new Property("#000000", "color", "color");
  constructor() {
    this.x.value = 0;
  }
  getProperties(): Property<any>[] {
    return [this.x, this.y, this.color];
  }
}
export class Circle extends Shape {
  radius = new Property(0, "number", "radius");
  isFill = new Property(false, "boolean", "isFill");
  constructor() {
    super();
  }
  override getProperties(): Property<any>[] {
    return [...super.getProperties(), this.radius, this.isFill];
  }
}
export class Rectangle extends Shape {
  width = new Property(0, "number", "width");
  height = new Property(0, "number", "height");
  constructor() {
    super();
  }
  override getProperties(): Property<any>[] {
    return [...super.getProperties(), this.width, this.height];
  }
}
export class Line extends Shape {
  x2 = new Property(0, "number", "x2");
  y2 = new Property(0, "number", "y2");
  constructor() {
    super();
  }
  override getProperties(): Property<any>[] {
    return [...super.getProperties(), this.x2, this.y2];
  }
}

export class Tool {
  name: string;
  icon: string;
  constructor(name: string, icon: string) {
    this.name = name;
    this.icon = icon;
  }
}

export class Plugin {
  onActivate(editor: VectorEditor) {}
  onDeActivate() {}
  onCreateProperty(property: Object) {
    //create observer for property
    //return html node

  }
}

export class Panel {
  protected htmlDiv: HTMLDivElement | undefined = undefined;
  protected createHTML() {}
  html(): HTMLDivElement | undefined {
    return this.htmlDiv;
  }
  clearHtml() {
    if (this.htmlDiv) {
      this.htmlDiv.innerHTML = "";
    }
  }
  update() {}
}

export class PropertyPanel extends Panel {
  protected selectedShape: Shape | undefined = undefined;
  protected observers: Observer<any>[] = [];
  constructor() {
    super();
    this.createHTML();
  }
  protected override createHTML() {
    const htmlDiv = document.createElement("div");
    htmlDiv.className = "bg-blue-200 w-[200px] p-1 flex flex-col gap-1";
    this.htmlDiv = htmlDiv;
  }
  setSelectedShape(shape: Shape | undefined) {
    if (shape === this.selectedShape) return;
    // this.removeAllObservers();
    this.selectedShape = shape;
    this.update();
  }

  protected removeAllObservers() {
    this.observers.forEach((observer) => {
      observer.remove();
    });
    if (this.selectedShape) {
      this.selectedShape.getProperties().forEach((property) => {
        property.removeDeadObservers();
      });
    }
    this.observers = [];
  }

  override update() {
    //clear
    this.clearHtml();
    //delete all observers
    this.removeAllObservers();
    //create fresh html and event listeners
    if (this.selectedShape) {
      this.selectedShape.getProperties().forEach((property) => {
        this.createPropertyHtml(property);
      });
    }
  }
  private createPropertyHtml(property: Property<any>) {
    const div = document.createElement("div");
    div.className = "flex flex-row gap-1";

    const label = document.createElement("label");
    label.className = " max-w-[50px] min-w-[50px]";
    label.innerText = property.name;
    div.appendChild(label);

    const getType = () => {
      switch (property.type) {
        case "boolean":
          return "checkbox";
        case "number":
          return "number";
        case "color":
          return "color";
      }
      return "string";
    };
    const type = getType();
    const input = document.createElement("input");
    input.className = "w-full ";
    input.value = property.value;
    input.type = type;
    if (type === "number" || type === "string") {
      input.addEventListener("input", (e: any) => {
        property.value = e.target.value;
      });
    } else if (type === "checkbox") {
      input.checked = property.value;
      input.addEventListener("input", (e: any) => {
        property.value = e.target.checked;
      });
    } else if (type === "color") {
      input.addEventListener("input", (e: any) => {
        property.value = e.target.value;
      });
    }
    div.appendChild(input);

    this.htmlDiv?.appendChild(div);
  }

  private reCreatePropertyHtml(property: Property<any>) {
    //clear dom
    this.clearHtml();
    const div = document.createElement("div");
    div.className = "flex flex-row gap-1";

    const label = document.createElement("label");
    label.className = " max-w-[50px] min-w-[50px]";
    label.innerText = property.name;
    div.appendChild(label);

    {
      const getType = () => {
        switch (property.type) {
          case "boolean":
            return "checkbox";
          case "number":
            return "number";
          case "color":
            return "color";
        }
        return "string";
      };
      const type = getType();
      const input = document.createElement("input");
      input.className = "w-full ";
      input.value = property.value;
      input.type = type;
      if (type === "number" || type === "string") {
        input.addEventListener("input", (e: any) => {
          property.value = e.target.value;
        });
      } else if (type === "checkbox") {
        input.checked = property.value;
        input.addEventListener("input", (e: any) => {
          property.value = e.target.checked;
        });
      } else if (type === "color") {
        input.addEventListener("input", (e: any) => {
          property.value = e.target.value;
        });
      }
      div.appendChild(input);
      const observer = property.addObserver((value) => {
        if (property.type == "boolean") {
          input.checked = property.value;
        } else {
          input.value = value;
        }
      });
      this.observers.push(observer);
    }

    this.htmlDiv?.appendChild(div);
  }
  setPropertyNode(node: any) {}
}
class PropertyUI {
  addButton() {}
  addGroup() {}
  addCheckbox() {}
}

export class EditorPanel extends Panel {
  constructor() {
    super();
    this.createHTML();
  }
  protected override createHTML() {
    const htmlDiv = document.createElement("div");
    htmlDiv.className = "absolute top-0 left-0 bg-orange-200 w-full h-full";
    this.htmlDiv = htmlDiv;
  }
}
export class ToolPanel extends Panel {
  constructor() {
    super();
    this.createHTML();
  }
  protected override createHTML() {
    const htmlDiv = document.createElement("div");
    htmlDiv.className =
      "h-[40px] bg-red-300 z-50 absolute p-2 top-3 left-1/2 -translate-x-1/2 flex flex-row gap-1 w-[300px]";
    this.htmlDiv = htmlDiv;
  }
}
class VectorEditorState extends Panel {
  protected plugins: Map<string, Plugin> = new Map();
  protected shapes: Shape[] = [];
  protected tools: Tool[] = [];
  protected selectedTool: Tool | undefined = undefined;
  protected selectedShapes: Shape[] = [];
  //panels
  protected editorPanel = new EditorPanel();
  protected toolPanel = new ToolPanel();
  protected propertyPanel = new PropertyPanel();
}
export default class VectorEditor extends VectorEditorState {
  constructor(private main: HTMLDivElement) {
    super();
    this.createHTML();
    //test
    {
      const shape = new Shape();
      const circle = new Circle();
      circle.color.addObserver((value) => {
        console.log("circle color", value);
      });
      circle.x.addObserver((value) => {
        console.log("circle x", value);
      });
      circle.isFill.addObserver((value) => {
        console.log("circle isFill", value);
      });

      this.propertyPanel.setSelectedShape(shape);
      setTimer(
        (times: number) => {
          shape.x.value = times * 10;
          this.propertyPanel.update();
        },
        1000,
        0,
        3,
        () => {
          this.propertyPanel.setSelectedShape(circle);
          setTimer(
            (times: number) => {
              circle.radius.value = times * 10;
              circle.isFill.value = !circle.isFill.value;
              this.propertyPanel.update();
            },
            1000,
            0,
            5
          );
        }
      );
    }
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

  addTool(tool: Tool) {}
  addPlugin(plugin: Plugin, name: string) {
    if (this.plugins.has(name)) {
      console.error(`Plugin with name: ${name} already exists`);
      return;
    }
    this.plugins.set(name, plugin);
    plugin.onActivate(this);
    console.log(`Plugin with name: ${name} added`);
  }
  removePlugin(name: string) {
    const plugin = this.plugins.get(name);
    if (plugin) {
      plugin.onDeActivate();
      this.plugins.delete(name);
      console.log(`Plugin with name: ${name} removed`);
    } else {
      console.error(`Plugin with name: ${name} does not exist`);
    }
  }

  //events
  protected onDraw(render: Render) {}

  protected onCreateProperty(property: Object) {
    this.plugins.forEach((plugin) => {
      plugin.onCreateProperty(property);
    });
    //add ui to property panel

  }
}

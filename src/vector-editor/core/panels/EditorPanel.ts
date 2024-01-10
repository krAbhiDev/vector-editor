import { Render } from "../../../others/Render";
import { Panel } from "../Panel";

export class EditorPanel extends Panel {
  protected _canvas?: HTMLCanvasElement;
  protected _ctx?: CanvasRenderingContext2D;
  protected _render?: Render;
  constructor() {
    super();
    this.createHTML();
  }
  protected override createHTML() {
    const htmlDiv = document.createElement("div");
    htmlDiv.className =
      "overflow-hidden absolute top-0 left-0 bg-orange-200 w-full h-full";
    this.htmlDiv = htmlDiv;
    //create canvas
    const canvas = document.createElement("canvas");
    canvas.className = " absolute top-0 left-0";
    htmlDiv.appendChild(canvas);
    this._canvas = canvas;

    //handle canvas resize
    window.addEventListener("resize", () => {
      canvas.width = htmlDiv.clientWidth - 2;
      canvas.height = htmlDiv.clientHeight - 2;
      render.clear();
    });
    //create context
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("cannot create canvas context");
    this._ctx = ctx;
    //create render
    const render = new Render(ctx);
    this._render = render;
    //draw full black rect
    render.clear();
    this.onStart();
  }
  onStart(): void {
    if (!this._canvas) throw new Error("canvas is undefined");
    const parent = this._canvas?.parentElement!!;
    this._canvas.width = parent.clientWidth - 2;
    this._canvas.height = parent.clientHeight - 2;
    this.render.clear();
  }
  get render() {
    if (!this._render) throw new Error("render is undefined");
    return this._render;
  }
}

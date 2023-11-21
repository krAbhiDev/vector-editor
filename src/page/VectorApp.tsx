import React, {
  Children,
  MutableRefObject,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import PaperCanvas, {
  PaperCanvasProps,
  PaperScope,
} from "../components/PaperCanvas";
import paper from "paper/dist/paper-core";

interface VectorState {
  tools: Tool[];
  setTools: React.Dispatch<React.SetStateAction<Tool[]>>;
  activeTool: Tool | null;
  setActiveTool: React.Dispatch<React.SetStateAction<Tool | null>>;
  setActiveToolListener: (l: ActiveToolChangeEvent) => void;
  addTool: (tool: Tool) => void;
  paperRef: MutableRefObject<paper.PaperScope | null>;
}
const VectorContext = createContext<VectorState | null>(null);

type ActiveToolChangeEvent = (tool: Tool | null) => void;

function VectorProvider({
  children,
  data,
}: {
  children?: React.ReactNode;
  data?: Partial<Omit<VectorState, "setShapes" | "setTools">>;
}) {
  // const [shapes, setShapes] = useState<Shape[]>(data?.shapes || []);
  const [tools, setTools] = useState<Tool[]>(data?.tools || []);
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const paperRef = useRef<PaperScope | null>(null);

  //event listener
  const [activeShapeChangeListener, setActiveShapeChangeListener] = useState<
    ActiveToolChangeEvent[]
  >([]);
  function setActiveToolListener(l: ActiveToolChangeEvent) {
    setActiveShapeChangeListener((e) => [...e, l]);
  }
  function addTool(tool: Tool) {
    setTools((t) => [...t, tool]);
  }

  useEffect(() => {
    activeShapeChangeListener.forEach((f) => f(activeTool));
  }, [activeTool]);
  return (
    <VectorContext.Provider
      value={{
        tools,
        setTools,
        activeTool,
        setActiveTool,
        setActiveToolListener,
        addTool,
        paperRef,
      }}
    >
      {children}
    </VectorContext.Provider>
  );
}

type Shape = paper.Shape;
type Property = (shape: Shape) => ReactNode;
interface Tool {
  name: string;
  property?: Property;
}

function ToolPanel() {
  const { tools, setActiveTool, activeTool } = useContext(
    VectorContext
  ) as VectorState;
  return (
    <div className="space-x-1 flex flex-row items-center  p-1  border    left-1/2   -translate-x-1/2 absolute mt-2 ">
      {tools.map((t, i) => (
        <button
          onClick={() => setActiveTool(tools[i])}
          key={i}
          className={`tool-item ${
            activeTool && tools[i].name == activeTool.name ? "!bg-blue-400" : ""
          } `}
        >
          {t.name}
        </button>
      ))}
    </div>
  );
}
function PropertyPanel() {
  const state = useContext(VectorContext) as VectorState;

  return (
    <div className=" w-[150px] absolute right-0 h-full bg-orange-200">
      {/* {state.activeTool &&
        state.activeTool.property &&
        state.activeTool.property(state.activeTool)} */}
    </div>
  );
}
function EditorPanel() {
  const state = useVector()
  useEffect(() => {
    const ps = state.paperRef.current!;
    if (!ps) return;
    const black = new paper.Color("black");

    {
      const shape = new ps.Path.Circle([100, 100], 30);
      shape.strokeColor = black;
      const clone = shape.clone();
      clone.position.x += 70;
      console.log({ segments: shape.segments });
    }
  }, []);
  //draw shapes
  return (
    <div className="w-screen h-screen absolute left-0 top-0">
      <PaperCanvas paperScopeRef={state.paperRef} />
    </div>
  );
}

function Vector({ children }: { children?: ReactNode }) {
  const tools: Tool[] = [{ name: "Circle" }, { name: "Line" }];
  const result = Children.toArray(children);
  console.log(result);
  return (
    <VectorProvider data={{ tools }}>
      <div className="w-screen h-screen">
        {children}
        <ToolPanel />
        <PropertyPanel />
        <EditorPanel />
      </div>
    </VectorProvider>
  );
}
function useVector() {
  const state = useContext(VectorContext) as VectorState;
  return state
}
function RectPlugin() {
  //register rect
  const state = useVector()
  const property = (shape: Shape) => {
    return <div>Rect Property</div>;
  };
  useEffect(() => {
    state.addTool({ name: "Rect", property });
    state.setActiveToolListener((e) => {
      console.log(e);
    });
  }, []);

  useEffect(() => {
    if (!state.paperRef.current) return;
    //console.log({ paper: state.paperRef });
    const black = new paper.Color("red");
    const ps = state.paperRef.current!;
    const shape = new paper.Path.Circle([100, 100], 30);
    shape.fillColor = black;
    shape.position.y+=100;
    console.log({ paper });
  }, [state]);
  return <div></div>;
}
function Property() {
  return <div></div>;
}
export default function VectorApp() {
  const [activeShape, setActiveShape] = useState<Shape | null>(null);

  return (
    <div>
      <Vector>
        <RectPlugin />
      </Vector>
    </div>
  );
}

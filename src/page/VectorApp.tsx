import React, {
  Children,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
interface VectorState {
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  tools: Tool[];
  setTools: React.Dispatch<React.SetStateAction<Tool[]>>;
  activeTool: Tool | null;
  setActiveTool: React.Dispatch<React.SetStateAction<Tool | null>>;
  setActiveToolListener: (l: ActiveToolChangeEvent) => void;
  addTool:(tool:Tool)=>void
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
  const [shapes, setShapes] = useState<Shape[]>(data?.shapes || []);
  const [tools, setTools] = useState<Tool[]>(data?.tools || []);
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  //event listener
  const [activeShapeChangeListener, setActiveShapeChangeListener] = useState<
    ActiveToolChangeEvent[]
  >([]);
  function setActiveToolListener(l: ActiveToolChangeEvent) {
    setActiveShapeChangeListener((e) => [...e, l]);
  }
  function addTool(tool:Tool){
    setTools((t)=>[...t,tool])
  }

  useEffect(() => {
    activeShapeChangeListener.forEach((f) => f(activeTool));
  }, [activeTool]);
  return (
    <VectorContext.Provider
      value={{
        shapes,
        setShapes,
        tools,
        setTools,
        activeTool,
        setActiveTool,
        setActiveToolListener,
        addTool
      }}
    >
      {children}
    </VectorContext.Provider>
  );
}

class Shape {
  name = "shape";
}
interface Tool {
  name: string;
}

function ToolPanel() {
  const { shapes, setShapes, tools, setActiveTool, activeTool } = useContext(
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
  return <div></div>;
}
function EditorPanel() {
  //draw shapes
  return <div></div>;
}
function Vector({ children }: { children?: ReactNode }) {
  const tools: Tool[] = [
    { name: "Circle" },
    { name: "Line" },
  ];
  const result = Children.toArray(children);
  console.log(typeof result[0]);
  return (
    <VectorProvider data={{ tools }}>
      <div className="w-screen h-screen">
        {children}
        <EditorPanel />
        <ToolPanel />
        <PropertyPanel />
      </div>
    </VectorProvider>
  );
}

function RectPlugin() {
  //register rect
  const state = useContext(VectorContext) as VectorState;
  useEffect(() => {
    state.addTool({name:"Rect"})
    state.setActiveToolListener((e) => {
      console.log(e);
    });
  }, []);
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

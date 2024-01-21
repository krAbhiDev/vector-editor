import { useRef } from "react";

function ToolPanelDesign() {
  return (
    <div className="w-full fixed h-full p-5 flex justify-center self-center">
      <div className="bg-red-50 w-full h-full flex flex-row">
        <div className="bg-green-200 flex-1 relative">
          {/* tool-panel */}
          <div className="h-[40px] bg-red-300 z-50 absolute p-2 top-3 left-1/2   -translate-x-1/2 flex flex-row gap-1">
            <button>Arrow</button>
            <button>Nothing</button>
            <button>Arrow</button>
          </div>
          {/* editor-panel */}
          <div className="absolute top-0 left-0 bg-orange-200 w-full h-full">
            canvas
          </div>
        </div>
        {/* property panel */}
        <div className="bg-blue-200 w-[200px] "></div>
      </div>
    </div>
  );
}

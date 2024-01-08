import { Fragment, ReactNode, useEffect, useState } from "react";

function TextItem({ value, keyName }: { value: any; keyName: string }) {
  return (
    <div className="">
      <span className="">{keyName}</span>:{value}
    </div>
  );
}
function ToggleItem({ obj, name }: { obj: any; name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const Item = ({ objKey: key }: { objKey: any }) => {
    const value = obj[key];
    const isObj = typeof value == "object";
    return isObj ? (
      <ToggleItem obj={value} name={key} />
    ) : (
      <TextItem value={value} keyName={key} />
    );
  };
  return (
    <div>
      <div className="flex items-center">
        <span
          onClick={() => setIsOpen(!isOpen)}
          className={`font-extrabold   inline-block ${isOpen && "rotate-90"}`}
        >
          {">"}
        </span>
        <span className="px-1">{name}</span>
      </div>
      {isOpen && (
        <div className="px-4 space-y-1">
          {Object.keys(obj).map((key, i) => (
            <Item key={i} objKey={key} />
          ))}
        </div>
      )}
    </div>
  );
}
function TreeView({}: any) {
  const [shapes, setShapes] = useState<any>({
    count: 2,
    circle: {
      radius: 10,
      x: 20,
      y: 30,
    },
    rect: {
      x: 5,
      y: 10,
      width: 50,
      height: 30,
    },
    array: [1, { x: 5, y: 10, width: 50, height: 30 }, 3, 4, 5],
  });

  useEffect(() => {
    for (let i = 0; i < 10; i++) {
      setShapes((old: any) => ({ ...old, old: old }));
    }
    setShapes([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  }, []);
  console.log(shapes);
  return (
    <div className="text-sm font-thin">
      <ToggleItem obj={shapes} name="shapes" />
    </div>
  );
}
export default function ObjectEditor() {
  const [object, setObject] = useState({});
  return (
    <div className="p-4">
      <TreeView />
    </div>
  );
}

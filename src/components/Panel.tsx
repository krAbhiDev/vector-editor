interface Props {
  className?: string;
  direction?: "top" | "bottom" | "left" | "right";
  align?: "center" | "top" | "bottom" | "left" | "right"; //top|bottom for direction left|right etc
  children?: React.ReactNode;
}
function buildClass(dir: string, align: string) {
  const centerX = " left-1/2   -translate-x-1/2 ";
  const centerY = " top-1/2   -translate-y-1/2 ";
  let classes = "";
  const lrtb = {
    left: "left-0",
    right: "right-0",
    top: "top-0",
    bottom: "bottom-0",
  };
  //horizontal
  if (dir == "top" || dir == "bottom") {
    classes +=
      ` flex-row space-x-1 ${lrtb[dir]} ` +
      (align == "center"
        ? centerX
        : align == "left" || align == "right"
        ? ` ${lrtb[align]} `
        : centerX);
  } else if (dir == "left" || dir == "right") {
    classes +=
      ` flex-col space-y-1 ${lrtb[dir]}` +
      (align == "center"
        ? centerY
        : align == "top" || align == "bottom"
        ? ` ${lrtb[align]} `
        : centerY);
  }
  return classes;
}
export default function Panel(props: Props) {
  //this div have direction and align relative to parent
  const dir = props.direction || "top";
  const align = props.align || "center";
  //   const isVertical = dir == "left" || dir == "right";
  let className = buildClass(dir, align);
  // const margin = {
  //   left: "ml-2",
  //   right: "mr-2",
  //   top: "mt-2",
  //   bottom: "mb-2 ",
  // };
  return (
    <div
      className={` z-10 flex justify-center   items-center   p-1 shadow-md absolute m-2 ${className} `}
    >
      {props.children}
    </div>
  );
}

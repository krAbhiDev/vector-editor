interface ExampleProps extends React.PropsWithChildren {}
export default function Example(props: ExampleProps) {
  return (
    <div className="border border-gray-100  min-h-[50px] w-full p-1 shadow-sm">
      {props.children}
    </div>
  );
}

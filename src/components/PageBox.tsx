
export default function PageBox({ children }: { children?: React.ReactNode }) {
  return (
    <div className="h-screen p-2 space-x-1 justify-center items-center flex">
      {children}
    </div>
  );
}

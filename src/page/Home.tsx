import { Link } from "react-router-dom";
import PageBox from "../components/PageBox";
import pages from "./pages";

export default function Home() {
  return (
    <div className="flex items-center flex-wrap justify-center   p-2 space-x-1  space-y-1">
      {pages.map(({ name }, i) => (
        <Link className="link block" key={i} to={"/" + name}>
          {name}
        </Link>
      ))}
    </div>
  );
}

import { Link } from "react-router-dom";
import PageBox from "../components/PageBox";
import pages from "./pages";

export default function Home() {
  return (
    <PageBox>
      {pages.map(({ name },i) => (
        <Link className="link" key={i} to={"/" + name}>{name}</Link>
      ))}
    </PageBox>
  );
}

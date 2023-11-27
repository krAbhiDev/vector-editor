import Home from "./page/Home";
import NoPage from "./page/NoPage";
import PanZoom from "./page/PanZoom";
import PaperDemo from "./page/PaperDemo";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import pages from "./page/pages";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Outlet  />}>
          <Route index element={<Home />} />
          {pages.map(({ name, component: E },i) => (
            <Route key={i} path={name} element={<E />} />
          ))}
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

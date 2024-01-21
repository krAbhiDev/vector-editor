import NoPage from "./page/NoPage";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import VectorApp from "./editor/VectorApp";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Outlet  />}>
          <Route index element={<VectorApp />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

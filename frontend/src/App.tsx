import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/login";
import { Home } from "./pages/home";
import { pages } from "./util/pages";
import { Canvas } from "./pages/canvas";

export const App = () => {
  return (
    <Routes>
      <Route index element={<Login />}></Route>
      <Route path={pages.HOME} element={<Home />}></Route>
      <Route path={pages.CANVAS} element={<Canvas />}></Route>
    </Routes>
  );
};

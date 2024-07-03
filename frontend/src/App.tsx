import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/login";
import { Home } from "./pages/home";
import { pages } from "./util/pages";

export const App = () => {
  return (
    <Routes>
      <Route index element={<Login />}></Route>
      <Route path={pages.HOME} element={<Home />}></Route>
    </Routes>
  );
};

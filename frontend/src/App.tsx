import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/login";

export const App = () => {
  return (
    <Routes>
      <Route index element={<Login />}></Route>
    </Routes>
  );
};

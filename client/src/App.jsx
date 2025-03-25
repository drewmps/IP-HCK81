import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./pages/Login.page";
import LoginLayout from "./layouts/Login.layout";
import RegisterPage from "./pages/Register.page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginLayout />}>
          <Route index element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

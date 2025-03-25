import { Navigate, Outlet } from "react-router";

export default function LoginLayout() {
  if (localStorage.getItem("access_token")) {
    return <Navigate to="/" />;
  } else {
    return <Outlet />;
  }
}

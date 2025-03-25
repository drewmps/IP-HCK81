import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";

export default function RootLayout() {
  if (localStorage.getItem("access_token")) {
    return (
      <>
        <Navbar />
        <Outlet />
      </>
    );
  } else {
    return <Navigate to="/login" />;
  }
}

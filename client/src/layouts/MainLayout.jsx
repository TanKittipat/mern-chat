import { Outlet } from "react-router";
import "./layout.css";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  const theme = "dark";
  return (
    <div data-theme={theme}>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;

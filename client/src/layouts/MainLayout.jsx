import { Outlet } from "react-router";
import "./layout.css";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "../stores/useThemeStore";

const MainLayout = () => {
  const { theme } = useThemeStore();

  return (
    <div data-theme={theme || "dark"}>
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  );
};

export default MainLayout;

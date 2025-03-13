import { Outlet } from "react-router";
import "./layout.css";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../stores/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";

const MainLayout = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const theme = "dark";
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth && authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div data-theme={theme}>
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  );
};

export default MainLayout;

import { Outlet } from "react-router";
import "./layout.css";

const MainLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default MainLayout;

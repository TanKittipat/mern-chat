import { useAuthStore } from "../stores/useAuthStore";
import { Navigate } from "react-router";

const LoginRedirect = ({ children }) => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <Navigate to={"/signin"} />;
  }

  return children;
};

export default LoginRedirect;

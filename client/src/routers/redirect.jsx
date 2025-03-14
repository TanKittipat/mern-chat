import { useAuthStore } from "../stores/useAuthStore";
import { Navigate } from "react-router";
import { useEffect } from "react";
import { Loader } from "lucide-react";

const LoginRedirect = ({ children }) => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to={"/signin"} />;
  }

  return children;
};

export default LoginRedirect;

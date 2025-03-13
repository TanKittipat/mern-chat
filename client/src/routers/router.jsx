import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Profile from "../pages/Profile";
import LoginRedirect from "./redirect";

const router = createBrowserRouter([
  {
    path: "",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: (
          <LoginRedirect>
            <Home />
          </LoginRedirect>
        ),
      },
      { path: "signup", element: <SignUp /> },
      { path: "signin", element: <SignIn /> },
      {
        path: "profile",
        element: (
          <LoginRedirect>
            <Profile />
          </LoginRedirect>
        ),
      },
    ],
  },
]);

export default router;

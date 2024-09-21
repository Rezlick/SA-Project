import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import MinimalLayout from "../components/MinimalLayout/minimalLayout";
import Loadable from "../components/third-party/Loadable";

const LoginPages = Loadable(lazy(() => import("../components/Pages/login/login")));

const LoginRoutes = (): RouteObject => {
  return {
    path: "/",
    element: <MinimalLayout />,
    children: [
      {
        path: "/",
        element: <LoginPages/>,
      },
      {
        path: "/login",
        element: <LoginPages />,
      },
    ],
  };
};

export default LoginRoutes;
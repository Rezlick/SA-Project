import { lazy } from "react";
import React from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/third-party/Loadable";
// import CustomerLayout from "../components/CustomerLayout/index";


const CustomerPages = Loadable(lazy(() => import("../components/Pages/customer/customer")));

const CustomerRoutes = (): RouteObject => {
    return {
      path: "/customer",
      element: <CustomerPages />,
      
    };
  };
  
  export default CustomerRoutes;
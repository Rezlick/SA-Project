import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/third-party/Loadable";
import CustomerLayout from "../components/CustomerLayout/customerlayout";

// Import customer pages
const CustomerPage = Loadable(lazy(() => import("../components/Pages/customer/customer"))); // หน้าหลักของลูกค้า

const CustomerRoutes = (): RouteObject => {
  const customerRotes = [
    {
      path: "/customer",
      element: <CustomerPage />,
    },
    {
      path: "/customer/:id",
      element: <CustomerPage />,
    },
    // {
    //   path: "/member/edit/:id",
    //   element: <EditMember />,
    // },
  ];

  return {
    path: "/", // เส้นทางหลักของลูกค้า
    element: <CustomerLayout />, // Layout หลักที่ใช้สำหรับหน้าลูกค้า
    children: customerRotes
  };
};

export default CustomerRoutes;
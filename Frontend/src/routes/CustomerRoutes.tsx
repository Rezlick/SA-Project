import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/third-party/Loadable";
import CustomerLayout from "../components/CustomerLayout/customerlayout";

// Import customer pages
const CustomerPage = Loadable(lazy(() => import("../components/Pages/customer/customer"))); // หน้าหลักของลูกค้า

const CustomerRoutes = (): RouteObject => {
  return {
    path: "/customer", // เส้นทางหลักของลูกค้า
    element: <CustomerLayout />, // Layout หลักที่ใช้สำหรับหน้าลูกค้า
    children: [
      {
        path: "/customer", // เส้นทางลูกแบบไม่มี path เพิ่มเติม, จะแสดงเป็นหน้าหลักที่ /customer/booking/:id
        element: <CustomerPage />, // หน้าหลักของลูกค้า (Booking page หรือหน้าอื่นๆ)
      },
    ],
  };
};

export default CustomerRoutes;
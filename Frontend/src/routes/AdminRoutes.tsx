import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/third-party/Loadable";

import FullLayout from "../components/FullLayout/fullLayout";

const MainPages = Loadable(lazy(() => import("../components/Pages/login/login")));
const Dashboard = Loadable(lazy(() => import("../components/Pages/dashboard/dashboard")));

const Member = Loadable(lazy(() => import("../components/Pages/member/member")));
const CreateMember = Loadable(lazy(() => import("../components/Pages/member/create/createMember")));
const EditMember = Loadable(lazy(() => import("../components/Pages/member/edit/editMember")));

const Employee = Loadable(lazy(() => import("../components/Pages/Employee/employee")));
const CreateEmployee = Loadable(lazy(() => import("../components/Pages/Employee/create/createEmployee")));
const EditEmployee = Loadable(lazy(() => import("../components/Pages/Employee/edit/editEmployee")));

const ProfileEdit = Loadable(lazy(() => import("../components/Pages/ProfileEdit/profileEdit")))
const ChangePassword = Loadable(lazy(() => import("../components/Pages/ProfileEdit/changePassword")))

const Receipt = Loadable(lazy(() => import("../components/Pages/Receipt/receipt")))
const Pay = Loadable(lazy(() => import("../components/Pages/Receipt/Pay/pay")))

const Booking = Loadable(lazy(() => import("../components/Pages/Booking/booking")));
const CreateBookingTable = Loadable(lazy(() => import("../components/Pages/Booking/Create/createBooking")));
const TableList = Loadable(lazy(() => import("../components/Pages/Booking/BookingList/bookingList")));
const EditBookingTable = Loadable(lazy(() => import("../components/Pages/Booking/Edit/editBooking")));

const Order = Loadable(lazy(() => import("../components/Pages/order/order")));
const OrderDetail = Loadable(lazy(() => import("../components/Pages/order/detail/detail")));



const ManageStock  = Loadable(lazy(() => import("../components/Pages/Managestock/Managestock")))
const StockBeveragesAndDesserts = Loadable(lazy(() => import("../components/Pages/Managestock/stock-data/StockBeveragesAndDesserts")))
const StockVegetable = Loadable(lazy(() => import("../components/Pages/Managestock/stock-data/StockVegetable")))
const StockMeat = Loadable(lazy(() => import("../components/Pages/Managestock/stock-data/StockMeat")))
const StockCondimentsAndSauce = Loadable(lazy(() => import("../components/Pages/Managestock/stock-data/StockCondimentsAndSauce")))
const StockNoodlesAndDough = Loadable(lazy(() => import("../components/Pages/Managestock/stock-data/StockNoodlesAndDough")))
const StockSeafood = Loadable(lazy(() => import("../components/Pages/Managestock/stock-data/StockSeafood")))
const Supplier = Loadable(lazy(() => import("../components/Pages/Managestock/Supplier/Suppliper")))
const EditStock = Loadable(lazy(() => import("../components/Pages/Managestock/Category/StockCategory/edit/index")))






const AdminRoutes = (isLoggedIn: boolean, role: string): RouteObject => {
  const dashboardRoute = {
    path: "/dashboard",
    element: <Dashboard />,
  };

  const employeeRoutes = [
    {
      path: "/employee",
      element: <Employee />,
    },
    {
      path: "/employee/create",
      element: <CreateEmployee />,
    },
    {
      path: "/employee/edit/:id",
      element: <EditEmployee />,
    },
  ];


  const memberRoutes = [
    {
      path: "/member",
      element: <Member />,
    },
    {
      path: "/member/create",
      element: <CreateMember />,
    },
    {
      path: "/member/edit/:id",
      element: <EditMember />,
    },
  ];

  const bookingRoutes = [
    {
      path: "/booking",
      element: <Booking />,
    },
    {
      path: "/booking/create",
      element: <CreateBookingTable />,
    },
    {
      path: "/booking/edit/:id",
      element: <EditBookingTable />,
    },
    {
      path: "/booking/booking_list",
      element: <TableList />,
    },
  ]
  const orderRoutes = [
    {
      path: "/order",
      element: <Order />,
    },
    {
      path: "/order/detail/:id",
      element: <OrderDetail />
    }
  ]

  const ManageStocks =[
    {
      path: "", 
      element: <ManageStock />,
    }
    ,
    {
      path: "Meat", 
      element: <StockMeat />,
      children: [
        {
          path: "EditStock",
          element: <EditStock />,
        },
      ],
    },
    {
      path: "Vegetable", 
      element: <StockVegetable />,
      children: [
        {
          path: "EditStock",
          element: <EditStock />,
        },
      ],
    },
    {
      path: "CondimentsAndSauce", 
      element: <StockCondimentsAndSauce />,
      children: [
        {
          path: "EditStock",
          element: <EditStock />,
        },
      ],
    },
    {
      path: "NoodlesAndDough", 
      element: <StockNoodlesAndDough />,
      children: [
        {
          path: "EditStock",
          element: <EditStock />,
        },
      ],
    },
    {
      path: "Seafood", 
      element: <StockSeafood />,
      children: [
        {
          path: "EditStock",
          element: <EditStock />,
        },
      ],
    },
    {
      path: "BeveragesAndDesserts", 
      element: <StockBeveragesAndDesserts />,
      children: [
        {
          path: "EditStock",
          element: <EditStock />,
        },
      ],
    }
    ,
    {
      path: "Supplier", 
      element: <Supplier />,
    },


  ]

  return {
    path: "/",
    element: isLoggedIn ? <FullLayout /> : <MainPages />,
    children: [
      // Dashboard route
      ...(role !== "Common" ? [dashboardRoute] : [] ) , //[dashboardRoute]

      {
        path: "/profileEdit",
        element: <ProfileEdit />,
      },
      {
        path: "/changePassword",
        element: <ChangePassword />,
      },
      {
        path: "/receipt",
        children: [
          {
            path: "/receipt",
            element: <Receipt />,
          },
          {

            path: "/receipt/pay",

            element: <Pay />
          },
        ]
      },
      {
        path: "/member",
        children: memberRoutes,
      },

      {
        path: "/booking",
        children: bookingRoutes,
      },

      {
        path: "/order",
        children: orderRoutes,
      },

      {
        path: "/ManageStock",
        children: ManageStocks,
      },

      // Employee routes, accessible only to IT role
      ...(role === "IT" ? [{
        path: "/employee",
        children: employeeRoutes,
      },
    ] : []),
    ],
  };
  
};

export default AdminRoutes;
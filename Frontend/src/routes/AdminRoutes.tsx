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

const Payment = Loadable(lazy(() => import("../components/Pages/Payment/payment")))

const Booking = Loadable(lazy(() => import("../components/Pages/Booking/booking")));
const CreateBookingTable = Loadable(lazy(() => import("../components/Pages/Booking/Create/createBooking")));
const TableList = Loadable(lazy(() => import("../components/Pages/Booking/BookingList/bookingList")));
const EditBookingTable = Loadable(lazy(() => import("../components/Pages/Booking/Edit/editBooking")));

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

  return {
    path: "/",
    element: isLoggedIn ? <FullLayout /> : <MainPages />,
    children: [
      // Dashboard route
      ...(role !== "Common" ? [dashboardRoute] : []),

      {
        path: "/profileEdit",
        element: <ProfileEdit />,
      },
      {
        path: "/changePassword",
        element: <ChangePassword />,
      },
      {
        path: "/payment",
        element: <Payment />,
      },

      {
        path: "/member",
        children: memberRoutes,
      },

      {
        path: "/booking",
        children: bookingRoutes,
      },

      // Employee routes, accessible only to IT role
      ...(role === "IT" ? [{
        path: "/employee",
        children: employeeRoutes,
      }] : []),
    ],
  };
};

export default AdminRoutes;
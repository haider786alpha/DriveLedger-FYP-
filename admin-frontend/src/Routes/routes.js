import CustomLogin from "../Pages/Auth/Login";
import React from "react";
import { Navigate } from "react-router-dom";

import AddDriver from "../Pages/Drivers/AddDriver";
import EditDriver from "../Pages/Drivers/EditDriver";
import AddCar from "../Pages/Cars/AddCar";
import EditCar from "../Pages/Cars/EditCar";
import AssignDriver from "../Pages/Assignments/AssignDriver";
import EditAssignment from "../Pages/Assignments/EditAssignment";
import AddUser from "../Pages/Users/AddUser";
import EditUser from "../Pages/Users/EditUser";
import AddPayment from "../Pages/Payments/AddPayment";
import EditPayment from "../Pages/Payments/EditPayment";
import AddExpense from "../Pages/Expenses/AddExpense";
import EditExpense from "../Pages/Expenses/EditExpense";
import AddRepair from "../Pages/Repairs/AddRepair";
import EditRepair from "../Pages/Repairs/EditRepair";

import Dashboard from "../Pages/Dashboard";
import Users from "../Pages/Users";
import Drivers from "../Pages/Drivers";
import DriverLocations from "../Pages/DriverLocations";
import Cars from "../Pages/Cars";
import Assignments from "../Pages/Assignments";
import Payments from "../Pages/Payments";
import Expenses from "../Pages/Expenses";
import Notifications from "../Pages/Notifications";
import Repairs from "../Pages/Repairs";
import Reports from "../Pages/Reports";
import BookingRequests from "../Pages/BookingRequests";

// Public/Auth pages
import Error404 from "../Pages/Utility/Error404-Page";
import Error500 from "../Pages/Utility/Error500-Page";

const authProtectedRoutes = [
  // DriveLedger Admin Pages
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/users", component: <Users /> },
  { path: "/drivers", component: <Drivers /> },
  { path: "/driver-locations", component: <DriverLocations /> },
  { path: "/cars", component: <Cars /> },
  { path: "/assignments", component: <Assignments /> },
  { path: "/booking-requests", component: <BookingRequests /> },
  { path: "/payments", component: <Payments /> },
  { path: "/expenses", component: <Expenses /> },
  { path: "/notifications", component: <Notifications /> },
  { path: "/repairs", component: <Repairs /> },
  { path: "/reports", component: <Reports /> },

  // DriveLedger Forms
  { path: "/add-driver", component: <AddDriver /> },
  { path: "/edit-driver/:id", component: <EditDriver /> },
  { path: "/add-car", component: <AddCar /> },
  { path: "/edit-car/:id", component: <EditCar /> },
  { path: "/assign-driver", component: <AssignDriver /> },
  { path: "/edit-assignment/:id", component: <EditAssignment /> },
  { path: "/add-user", component: <AddUser /> },
  { path: "/edit-user/:id", component: <EditUser /> },
  { path: "/add-payment", component: <AddPayment /> },
  { path: "/edit-payment/:id", component: <EditPayment /> },
  { path: "/add-expense", component: <AddExpense /> },
  { path: "/edit-expense/:id", component: <EditExpense /> },
  { path: "/add-repair", component: <AddRepair /> },
  { path: "/edit-repair/:id", component: <EditRepair /> },

  // Default redirect
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
];

   const publicRoutes = [
  // Main authentication pages
  { path: "/login", component: <CustomLogin /> },
  
  // Error pages
  { path: "/pages-404", component: <Error404 /> },
  { path: "/pages-500", component: <Error500 /> },
];

export { authProtectedRoutes, publicRoutes };
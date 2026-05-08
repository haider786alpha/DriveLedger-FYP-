// import CustomLogin from "../Pages/Auth/Login";
// import React from "react";
// import { Navigate } from "react-router-dom";
// import AddDriver from "../Pages/Drivers/AddDriver";
// import EditDriver from "../Pages/Drivers/EditDriver";
// import AddCar from "../Pages/Cars/AddCar";
// import EditCar from "../Pages/Cars/EditCar";
// import AssignDriver from "../Pages/Assignments/AssignDriver";
// import EditAssignment from "../Pages/Assignments/EditAssignment";
// import AddUser from "../Pages/Users/AddUser";
// import EditUser from "../Pages/Users/EditUser";
// import AddPayment from "../Pages/Payments/AddPayment";
// import EditPayment from "../Pages/Payments/EditPayment";
// import AddExpense from "../Pages/Expenses/AddExpense";
// import EditExpense from "../Pages/Expenses/EditExpense";
// import AddRepair from "../Pages/Repairs/AddRepair";
// import EditRepair from "../Pages/Repairs/EditRepair";
// import AddNotification from "../Pages/Notifications/AddNotification";

// import Dashboard from "../Pages/Dashboard";
// import Users from "../Pages/Users";
// import Drivers from "../Pages/Drivers";
// import Cars from "../Pages/Cars";
// import Assignments from "../Pages/Assignments";
// import Payments from "../Pages/Payments";
// import Expenses from "../Pages/Expenses";
// import Notifications from "../Pages/Notifications";
// import Repairs from "../Pages/Repairs";
// import Reports from "../Pages/Reports";
// import DriverLocations from "../Pages/DriverLocations";



// //Dashboard
// // import Dashboard from "../Pages/Dashboard";

// // Import Calender
// import Calender from "../Pages/Calender";


// // Import E-mail
// import Inbox from "../Pages/E-mail/Inbox";
// import ReadEmail from "../Pages/E-mail/ReadEmail";
// import EmailCompose from "../Pages/E-mail/EmailCompose";

// // Import Authentication pages
// import Login from "../Pages/Authentication/Login";
// import ForgetPasswordPage from "../Pages/Authentication/ForgetPassword";
// import Logout from "../Pages/Authentication/Logout";
// import Register from "../Pages/Authentication/Register";
// import UserProfile from "../Pages/Authentication/user-profile";

// // Import Authentication Inner Pages
// import Login1 from "../Pages/AuthenticationPages/Login";
// import Register1 from "../Pages/AuthenticationPages/Register";
// import RecoverPassword from "../Pages/AuthenticationPages/RecoverPassword";
// import LockScreen from "../Pages/AuthenticationPages/LockScreen";

// // Import Utility Pages
// import StarterPage from "../Pages/Utility/Starter-Page";
// import Maintenance from "../Pages/Utility/Maintenance-Page";
// import ComingSoon from "../Pages/Utility/ComingSoon-Page";
// import TimeLine from "../Pages/Utility/TimeLine-Page";
// import FAQs from "../Pages/Utility/FAQs-Page";
// import Pricing from "../Pages/Utility/Pricing-Page";
// import Error404 from "../Pages/Utility/Error404-Page";
// import Error500 from "../Pages/Utility/Error500-Page";

// // Import UIElement Pages
// import UiAlerts from "../Pages/UiElements/UiAlerts";
// import UiBadge from "../Pages/UiElements/UiBadge";
// import UiBreadcrumb from "../Pages/UiElements/UiBreadcrumb";
// import UiButtons from "../Pages/UiElements/UiButtons";
// import UiCards from "../Pages/UiElements/UiCards";
// import UiCarousel from "../Pages/UiElements/UiCarousel";
// import UiDropdown from "../Pages/UiElements/UiDropdowns";
// import UiGrid from "../Pages/UiElements/UiGrid";
// import UiImages from "../Pages/UiElements/UiImages";
// import UiLightbox from "../Pages/UiElements/UiLightbox";
// import UiModals from "../Pages/UiElements/UiModals";
// import UiOffcanvas from "../Pages/UiElements/UiOffcanvas";
// import UiRangeSlider from "../Pages/UiElements/UiRangeSlider";
// import UiSessionTimeout from "../Pages/UiElements/UiSessionTimeout";
// import UiPagination from "../Pages/UiElements/UiPagination";
// import UiProgressBars from "../Pages/UiElements/UiProgressBars";
// import UiPlaceholders from "../Pages/UiElements/UiPlaceholders";
// import UiTabs from "../Pages/UiElements/UiTabs&Accordions";
// import UiTypography from "../Pages/UiElements/UiTypography";
// import UiToasts from "../Pages/UiElements/UiToasts";
// import UiVideo from "../Pages/UiElements/UiVideo";
// import UiPopovers from "../Pages/UiElements/UiPopovers&Tooltips";
// import UiRating from "../Pages/UiElements/UiRating";

// // Import Forms
// import FormEditors from "../Pages/Forms/FormEditors";
// import FormUpload from "../Pages/Forms/FormUpload";
// import FormMask from "../Pages/Forms/FormMask";
// import FormElements from "../Pages/Forms/FormElements";
// import FormAdvanced from "../Pages/Forms/FormAdvanced";
// import FormValidations from "../Pages/Forms/FormValidations";
// import FormWizard from "../Pages/Forms/FormWizard";

// // Import Tables
// import BasicTable from "../Pages/Tables/BasicTable.js";
// import ListJs from "../Pages/Tables/ListTables/ListTables";
// import DataTable from "../Pages/Tables/DataTables/DataTables";


// // Import Charts
// import ApexCharts from "../Pages/Charts/ApexCharts";
// import ChartJs from "../Pages/Charts/ChartjsCharts";
// import Sparklinechart from "../Pages/Charts/SparklineCharts";
// import FloatChart from "../Pages/Charts/FloatCharts";
// import JknobCharts from "../Pages/Charts/JqueryKnobCharts";

// // Import Icon Pages
// import IconMaterialdesign from "../Pages/Icons/IconMaterialdesign";
// import IconFontawesome from "../Pages/Icons/IconFontAwesome";
// import IconDripicons from "../Pages/Icons/IconDrip";
// import IconBoxicons from "../Pages/Icons/IconBoxicons"

// // Import Map Pages
// import VectorMaps from "../Pages/Maps/VectorMap";
// import MapsGoogle from "../Pages/Maps/GoogleMap.js";


// const authProtectedRoutes = [
//   // DriveLedger Admin Pages
//   { path: "/dashboard", component: <Dashboard /> },
//   { path: "/users", component: <Users /> },
//   { path: "/drivers", component: <Drivers /> },
//   { path: "/driver-locations", component: <DriverLocations /> },
//   { path: "/cars", component: <Cars /> },
//   { path: "/assignments", component: <Assignments /> },
//   { path: "/payments", component: <Payments /> },
//   { path: "/expenses", component: <Expenses /> },
//   { path: "/notifications", component: <Notifications /> },
//   { path: "/repairs", component: <Repairs /> },
//   { path: "/reports", component: <Reports /> },

//   //editdriverdetails form
//   { path: "/add-driver", component: <AddDriver /> },
//   { path: "/edit-driver/:id", component: <EditDriver /> },
//   { path: "/add-car", component: <AddCar /> },
//   { path: "/edit-car/:id", component: <EditCar /> },
//   { path: "/assign-driver", component: <AssignDriver /> },
//   { path: "/edit-assignment/:id", component: <EditAssignment /> },
//   { path: "/add-user", component: <AddUser /> },
//   { path: "/edit-user/:id", component: <EditUser /> },
//   { path: "/add-payment", component: <AddPayment /> },
//   { path: "/edit-payment/:id", component: <EditPayment /> },
//   { path: "/add-expense", component: <AddExpense /> },
//   { path: "/edit-expense/:id", component: <EditExpense /> },
//   { path: "/add-repair", component: <AddRepair /> },
//   { path: "/edit-repair/:id", component: <EditRepair /> },
//   { path: "/add-notification", component: <AddNotification /> },

//   // default redirect
//   {
//     path: "/",
//     exact: true,
//     component: <Navigate to="/dashboard" />,
//   },
// ];



// const publicRoutes = [
//   // Authentication Page
//   { path: "/logout", component: <Logout /> },
//   { path: "/login", component: <CustomLogin /> },
//   { path: "/forgot-password", component: <ForgetPasswordPage /> },
//   { path: "/register", component: <Register /> },

//   // Authentication Inner Pages
//   { path: "/auth-login", component: <Login1 /> },
//   { path: "/auth-register", component: <Register1 /> },
//   { path: "/auth-recoverpw", component: <RecoverPassword /> },
//   { path: "/auth-lock-screen", component: <LockScreen /> },

//   // Utility Pages
//   { path: "/pages-404", component: <Error404 /> },
//   { path: "/pages-500", component: <Error500 /> },
//   { path: "/pages-maintenance", component: <Maintenance /> },
//   { path: "/pages-comingsoon", component: <ComingSoon /> },
// ];

// export { authProtectedRoutes, publicRoutes };


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
// import AddNotification from "../Pages/Notifications/AddNotification";

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

// Public/Auth pages
import ForgetPasswordPage from "../Pages/Authentication/ForgetPassword";
import Logout from "../Pages/Authentication/Logout";
import Register from "../Pages/Authentication/Register";

// Template auth pages still kept because publicRoutes currently use them
// import Login1 from "../Pages/AuthenticationPages/Login";
// import Register1 from "../Pages/AuthenticationPages/Register";
// import RecoverPassword from "../Pages/AuthenticationPages/RecoverPassword";
// import LockScreen from "../Pages/AuthenticationPages/LockScreen";

// Utility pages still kept because publicRoutes currently use them
// import Maintenance from "../Pages/Utility/Maintenance-Page";
// import ComingSoon from "../Pages/Utility/ComingSoon-Page";
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
  // { path: "/add-notification", component: <AddNotification /> },

  // Default redirect
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
];

// const publicRoutes = [
//   // Main authentication pages
//   { path: "/logout", component: <Logout /> },
//   { path: "/login", component: <CustomLogin /> },
//   { path: "/forgot-password", component: <ForgetPasswordPage /> },
//   { path: "/register", component: <Register /> },

//   // Template auth pages kept for now
//   { path: "/auth-login", component: <Login1 /> },
//   { path: "/auth-register", component: <Register1 /> },
//   { path: "/auth-recoverpw", component: <RecoverPassword /> },
//   { path: "/auth-lock-screen", component: <LockScreen /> },

//   // Utility pages kept for now
//   { path: "/pages-404", component: <Error404 /> },
//   { path: "/pages-500", component: <Error500 /> },
//   { path: "/pages-maintenance", component: <Maintenance /> },
//   { path: "/pages-comingsoon", component: <ComingSoon /> },
// ];

   const publicRoutes = [
  // Main authentication pages
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <CustomLogin /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },

  // Error pages
  { path: "/pages-404", component: <Error404 /> },
  { path: "/pages-500", component: <Error500 /> },
];

export { authProtectedRoutes, publicRoutes };
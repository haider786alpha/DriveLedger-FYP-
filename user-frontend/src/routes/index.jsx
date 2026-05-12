import { lazy } from 'react';
import { Navigate } from 'react-router-dom';


// Driver Panel Pages
const Dashboard = lazy(() => import('@/app/(admin)/dashboard/analytics/page'));
const Profile = lazy(() => import('@/app/(admin)/profile/page'));
const AssignedCar = lazy(() => import('@/app/(admin)/assigned-car/page'));
const PaymentHistory = lazy(() => import('@/app/(admin)/payment-history/page'));
const PendingDues = lazy(() => import('@/app/(admin)/pending-dues/page'));
const Alerts = lazy(() => import('@/app/(admin)/alerts/page'));
const Support = lazy(() => import('@/app/(admin)/support/page'));
const RepairStatus = lazy(() => import('@/app/(admin)/repair-status/page'));
const ShareLocation = lazy(() => import('@/app/(admin)/share-location/page'));

// Auth / Error Pages
const AuthSignIn = lazy(() => import('@/app/(other)/auth/sign-in/page'));
const ResetPassword = lazy(() => import('@/app/(other)/auth/reset-pass/page'));
const NotFound = lazy(() => import('@/app/(other)/(error-pages)/error-404/page'));

const initialRoutes = [
  {
    path: '/',
    name: 'root',
    element: <Navigate to="/dashboard" />,
  },
  {
    path: '*',
    name: 'not-found',
    element: <Navigate to="/dashboard" />,
  },
];

const driverRoutes = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    name: 'My Profile',
    path: '/profile',
    element: <Profile />,
  },
  {
    name: 'Assigned Car',
    path: '/assigned-car',
    element: <AssignedCar />,
  },
  {
    name: 'Payment History',
    path: '/payment-history',
    element: <PaymentHistory />,
  },
  {
    name: 'Pending Dues',
    path: '/pending-dues',
    element: <PendingDues />,
  },
  {
    name: 'Alerts',
    path: '/alerts',
    element: <Alerts />,
  },
  {
    name: 'Support',
    path: '/support',
    element: <Support />,
  },
  {
    name: 'Repair Status',
    path: '/repair-status',
    element: <RepairStatus />,
  },
  {
    name: 'Share Location',
    path: '/share-location',
    element: <ShareLocation />,
  },
];

export const authRoutes = [
  {
    path: '/auth/sign-in',
    name: 'Sign In',
    element: <AuthSignIn />,
  },
  {
    name: '404 Error',
    path: '/error-404',
    element: <NotFound />,
  },
  {
  name: 'Reset Password',
  path: '/auth/reset-pass',
  element: <ResetPassword />,
},
];

export const appRoutes = [...initialRoutes, ...driverRoutes];
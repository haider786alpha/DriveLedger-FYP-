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

// Auth Pages
const AuthSignIn = lazy(() => import('@/app/(other)/auth/sign-in/page'));
const AuthSignIn2 = lazy(() => import('@/app/(other)/auth/sign-in-2/page'));
const AuthSignUp = lazy(() => import('@/app/(other)/auth/sign-up/page'));
const AuthSignUp2 = lazy(() => import('@/app/(other)/auth/sign-up-2/page'));
const ResetPassword = lazy(() => import('@/app/(other)/auth/reset-pass/page'));
const ResetPassword2 = lazy(() => import('@/app/(other)/auth/reset-pass-2/page'));
const LockScreen = lazy(() => import('@/app/(other)/auth/lock-screen/page'));
const LockScreen2 = lazy(() => import('@/app/(other)/auth/lock-screen-2/page'));
const NotFound = lazy(() => import('@/app/(other)/(error-pages)/error-404/page'));
const NotFound2 = lazy(() => import('@/app/(other)/(error-pages)/error-404-2/page'));
const Maintenance = lazy(() => import('@/app/(other)/maintenance/page'));
const ComingSoon = lazy(() => import('@/app/(other)/coming-soon/page'));

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
    name: 'Sign In 2',
    path: '/auth/sign-in-2',
    element: <AuthSignIn2 />,
  },
  {
    name: 'Sign Up',
    path: '/auth/sign-up',
    element: <AuthSignUp />,
  },
  {
    name: 'Sign Up 2',
    path: '/auth/sign-up-2',
    element: <AuthSignUp2 />,
  },
  {
    name: 'Reset Password',
    path: '/auth/reset-pass',
    element: <ResetPassword />,
  },
  {
    name: 'Reset Password 2',
    path: '/auth/reset-pass-2',
    element: <ResetPassword2 />,
  },
  {
    name: 'Lock Screen',
    path: '/auth/lock-screen',
    element: <LockScreen />,
  },
  {
    name: 'Lock Screen 2',
    path: '/auth/lock-screen-2',
    element: <LockScreen2 />,
  },
  {
    name: '404 Error',
    path: '/error-404',
    element: <NotFound />,
  },
  {
    name: 'Maintenance',
    path: '/maintenance',
    element: <Maintenance />,
  },
  {
    name: '404 Error 2',
    path: '/error-404-2',
    element: <NotFound2 />,
  },
  {
    name: 'Coming Soon',
    path: '/coming-soon',
    element: <ComingSoon />,
  },
];

export const appRoutes = [...initialRoutes, ...driverRoutes];
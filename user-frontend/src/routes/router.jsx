import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import { useAuthContext } from "@/context/useAuthContext";
import { appRoutes, authRoutes } from "@/routes/index";
import AdminLayout from "@/layouts/AdminLayout";
import HomePage from "@/app/home/page";
import BookingPage from "@/app/booking/page";

const AppRouter = (props) => {
  const { isAuthenticated } = useAuthContext();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/booking" element={<BookingPage />} />

      {(authRoutes || []).map((route, idx) => (
        <Route
          key={idx + route.name}
          path={route.path}
          element={<AuthLayout {...props}>{route.element}</AuthLayout>}
        />
      ))}

      {(appRoutes || []).map((route, idx) => (
        <Route
          key={idx + route.name}
          path={route.path}
          element={
            isAuthenticated ? (
              <AdminLayout {...props}>{route.element}</AdminLayout>
            ) : (
              <Navigate
                to={{
                  pathname: "/auth/sign-in",
                  search: "redirectTo=" + route.path,
                }}
              />
            )
          }
        />
      ))}
    </Routes>
  );
};

export default AppRouter;
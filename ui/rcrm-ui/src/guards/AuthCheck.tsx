import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/Slices/authSlice";

const AuthCheck = () => {
  const location = useLocation();
  const { isAuthenticated } = useSelector(selectAuth);

  if (isAuthenticated) {
    // Check if there's a return URL
    const returnUrl = location.state?.from?.pathname;

    // Redirect to return URL if it exists, otherwise redirect to the dashboard
    return <Navigate to={returnUrl || "/secure/dashboard"} replace />;
  }

  // If not authenticated, allow access to the protected route
  return <Outlet />;
};

export default AuthCheck;

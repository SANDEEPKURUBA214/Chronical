// PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function PrivateRoute() {
  const { user } = useAuthStore();
  return user ? <Outlet /> : <Navigate to="/login" />;
}



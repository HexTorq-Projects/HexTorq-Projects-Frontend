import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

export function AdminRoute() {
  const token = useAdminAuthStore((s) => s.token);
  if (!token) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}

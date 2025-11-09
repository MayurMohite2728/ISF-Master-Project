import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { ReactNode } from "react";

type Role = "officer" | "supervisor" | "admin" | "tech_approver";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: Role[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useUser();

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user's role is not in allowed roles, redirect to their appropriate dashboard
  if (user.role && !allowedRoles.includes(user.role)) {
    const roleRoutes: Record<Role, string> = {
      officer: "/officer/dashboard",
      supervisor: "/supervisor/dashboard",
      admin: "/admin/dashboard",
      tech_approver: "/tech-approver/dashboard",
    };
    
    return <Navigate to={roleRoutes[user.role]} replace />;
  }

  return <>{children}</>;
};


import { useLocation } from "react-router-dom";
import { Layout } from "./Layout";
import { useUser } from "@/contexts/UserContext";

interface RouteLayoutProps {
  children: React.ReactNode;
}

export const RouteLayout = ({ children }: RouteLayoutProps) => {
  const location = useLocation();
  const { user } = useUser();

  // Routes that don't need header
  const noHeaderRoutes = ["/"];
  
  // Routes that need minimal footer (404 page also needs minimal, but we'll check pathname)
  const minimalFooterRoutes = ["/"];

  // Determine role based on route (fallback when user context is not available)
  const getRoleFromRoute = (): "officer" | "supervisor" | "admin" | "tech_approver" | undefined => {
    const pathname = location.pathname;
    if (pathname.startsWith("/officer") || 
        pathname.startsWith("/request")) {
      return "officer";
    }
    if (pathname.startsWith("/supervisor")) {
      return "supervisor";
    }
    if (pathname.startsWith("/admin")) {
      return "admin";
    }
    if (pathname.startsWith("/tech-approver")) {
      return "tech_approver";
    }
    if (pathname.startsWith("/commander")) {
      return "supervisor"; // Map commander to supervisor for backwards compatibility
    }
    // Service catalog is shared, rely on user context
    if (pathname.startsWith("/service-catalog")) {
      return undefined; // Will use user context role
    }
    return undefined;
  };

  // Use user's role if available, otherwise determine from route
  const role = user?.role || getRoleFromRoute();
  const showHeader = !noHeaderRoutes.includes(location.pathname);
  const footerVariant = minimalFooterRoutes.includes(location.pathname) || 
                        (location.pathname !== "/" && !role) ? "minimal" : "default";

  return (
    <Layout role={role} showHeader={showHeader} footerVariant={footerVariant}>
      {children}
    </Layout>
  );
};


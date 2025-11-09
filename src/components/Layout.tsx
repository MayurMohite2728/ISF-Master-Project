import { ReactNode } from "react";
import { Header } from "./Header";
// import { Footer } from "./Footer"; // Commented out: Dashboards don't contain footers
import { NavigationSidebar } from "./NavigationSidebar";
import { useI18n } from "@/contexts/I18nContext";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  role?: "officer" | "supervisor" | "admin" | "tech_approver";
  showHeader?: boolean;
  showFooter?: boolean;
  footerVariant?: "default" | "minimal";
}

export const Layout = ({
  children,
  role,
  showHeader = true,
  showFooter = true,
  footerVariant = "default",
}: LayoutProps) => {
  const { dir } = useI18n();
  const location = useLocation();

  // Don't show sidebar on login page
  const showSidebar = location.pathname !== "/" && role;

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden" dir={dir}>
      {/* Header always at the top, full width */}
      {showHeader && <Header role={role} />}
      
      {/* Content area below header */}
      <div className="flex-1 flex overflow-hidden">
        {showSidebar ? (
          <NavigationSidebar>
            <main className="flex-1 overflow-y-auto h-full">{children}</main>
          </NavigationSidebar>
        ) : (
          <main className="flex-1 overflow-y-auto h-full">{children}</main>
        )}
      </div>
      {/* Footer commented out: Dashboards don't contain footers */}
      {/* {showFooter && <Footer variant={footerVariant} />} */}
    </div>
  );
};


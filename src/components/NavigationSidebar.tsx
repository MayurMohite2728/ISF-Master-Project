import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { useI18n } from "@/contexts/I18nContext";
import { useUser } from "@/contexts/UserContext";
import {
  LayoutDashboard,
  List,
  FileText,
  CheckSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationSidebarProps {
  children: React.ReactNode;
}

const CollapseButton = () => {
  const { toggleSidebar, state } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="ml-auto group-data-[collapsible=icon]:ml-0 p-1.5 rounded-md hover:bg-muted transition-colors flex-shrink-0 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
      aria-label="Toggle sidebar"
      title={state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
    >
      {state === "expanded" ? (
        <PanelLeftClose className="h-4 w-4 text-muted-foreground" />
      ) : (
        <PanelLeftOpen className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  );
};

export const NavigationSidebar = ({ children }: NavigationSidebarProps) => {
  const location = useLocation();
  const { t, dir } = useI18n();
  const { user } = useUser();

  // Determine role from user or route
  const getRoleFromRoute = (): "officer" | "supervisor" | "admin" | "tech_approver" | undefined => {
    const pathname = location.pathname;
    if (
      pathname.startsWith("/officer") ||
      pathname.startsWith("/request")
    ) {
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
    // Service catalog is shared between officer and supervisor, rely on user context
    if (pathname.startsWith("/service-catalog")) {
      return undefined; // Will use user context role
    }
    return undefined;
  };

  const role = user?.role || getRoleFromRoute();

  // Officer navigation items
  const officerNavItems = [
    {
      title: "My Requests Dashboard",
      icon: LayoutDashboard,
      path: "/officer/dashboard",
    },
    {
      title: t("sidebar.serviceCatalog"),
      icon: List,
      path: "/service-catalog",
    },
    {
      title: t("sidebar.requestStatus"),
      icon: FileText,
      path: "/request/status",
    },
  ];

  // Supervisor navigation items
  const supervisorNavItems = [
    {
      title: t("sidebar.supervisordashboard"),
      icon: LayoutDashboard,
      path: "/supervisor/dashboard",
    },
    {
      title: t("sidebar.serviceCatalog"),
      icon: List,
      path: "/service-catalog",
    },
    {
      title: t("sidebar.requestStatus"),
      icon: FileText,
      path: "/request/status",
    },
    {
      title:  t("sidebar.teamapprovals"),
      icon: CheckSquare,
      path: "/supervisor/approvals",
    },
  ];

  // Admin navigation items
  const adminNavItems = [
    {
      title: "Admin Control Panel",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
   
    {
      title: "Review Approvals",
      icon: CheckSquare,
      path: "/admin/assign",
    },
    
  ];

  // Technical Approver navigation items
  const techApproverNavItems = [
    {
      title: t("sidebar.techdashboard"),
      icon: LayoutDashboard,
      path: "/tech-approver/dashboard",
    },
    {
      title: t("sidebar.techapprovals"),
      icon: CheckSquare,
      path: "/tech-approver/reviews",
    },
   
  
  ];

  const getNavItems = () => {
    switch (role) {
      case "officer":
        return officerNavItems;
      case "supervisor":
        return supervisorNavItems;
      case "admin":
        return adminNavItems;
      case "tech_approver":
        return techApproverNavItems;
      default:
        return officerNavItems;
    }
  };

  const navItems = getNavItems();

  const isActive = (path: string) => {
    // Exact match for dashboards
    if (
      path === "/officer/dashboard" || 
      path === "/supervisor/dashboard" || 
      path === "/admin/dashboard" || 
      path === "/tech-approver/dashboard" ||
      path === "/commander/dashboard"
    ) {
      return location.pathname === path;
    }
    // Starts with for other paths
    return location.pathname.startsWith(path);
  };

  // Don't show sidebar on login page or if no role
  if (location.pathname === "/" || !role) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar
        side={dir === "rtl" ? "right" : "left"}
        collapsible="icon"
        className="border-r border-border bg-white"
      >
        <SidebarHeader className="border-b border-border p-2 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-2">
          <div className="flex items-center justify-end group-data-[collapsible=icon]:justify-center">
            <CollapseButton />
          </div>
        </SidebarHeader>
        <SidebarContent className="mt-4 px-2">
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    className={cn(
                      "w-full justify-start gap-3 font-montserrat",
                      active && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex-1">{children}</SidebarInset>
    </SidebarProvider>
  );
};

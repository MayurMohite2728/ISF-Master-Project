import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/contexts/I18nContext";
import { useUser } from "@/contexts/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Users, Bell, CheckCircle2, AlertCircle, Info, HelpCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import emblem from "@/assets/lekhwiya-logo.jpg";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "success" | "warning" | "info";
}

interface HeaderProps {
  role?: "officer" | "supervisor" | "admin" | "tech_approver";
  showLanguageToggle?: boolean;
}

export const Header = ({ role, showLanguageToggle = true }: HeaderProps) => {
  const navigate = useNavigate();
  const { t, language, setLanguage, dir } = useI18n();
  const { user, logout, switchUser } = useUser();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  
  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Request Approved",
      message: "Your desktop phone request (REQ-00841) has been approved by Commander.",
      time: "5 minutes ago",
      read: false,
      type: "success",
    },
    {
      id: "2",
      title: "New Request Pending",
      message: "A new laptop request requires your approval.",
      time: "1 hour ago",
      read: false,
      type: "warning",
    },
    {
      id: "3",
      title: "Provisioning Complete",
      message: "VoIP Extension EXT-44129 has been provisioned successfully.",
      time: "2 hours ago",
      read: true,
      type: "info",
    },
    {
      id: "4",
      title: "Request Rejected",
      message: "Your network access request has been rejected. Please review the reason.",
      time: "1 day ago",
      read: true,
      type: "warning",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((n) => ({ ...n, read: true }))
    );
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const handleLanguageChange = (lang: "en" | "ar") => {
    if (lang !== language) {
      setLanguage(lang);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSwitchUser = () => {
    switchUser();
    navigate("/");
  };

  const getUserInitials = () => {
    if (!user || !role) return "U";
    let name = "";
    switch (role) {
      case "officer":
        name = t("officer.name");
        break;
      case "supervisor":
        name = t("supervisor.name");
        break;
      case "admin":
        name = t("admin.name");
        break;
      case "tech_approver":
        name = t("techApprover.name");
        break;
      default:
        name = "User";
    }
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getUserName = () => {
    if (!user || !role) return "User";
    switch (role) {
      case "officer":
        return t("officer.name");
      case "supervisor":
        return t("supervisor.name");
      case "admin":
        return t("admin.name");
      case "tech_approver":
        return t("techApprover.name");
      default:
        return "User";
    }
  };

  return (
    <header className="h-16 flex-shrink-0 w-full bg-primary-foreground border-b border-primary/20"
  style={{
    backgroundImage: "url('/headbag.png')",
  
  }}>
      <div className="w-full h-full px-6 flex items-center justify-between" dir={dir}>
        <div className="flex items-center gap-3 min-w-0">
          <img src={emblem} alt="Lekhwiya" className="h-10 w-10 object-contain flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <h1 className="text-primary font-montserrat font-bold  text-base leading-tight truncate">
              {t("common.appName")}
            </h1>
            <p className="text-primary text-sm font-semibold font-montserrat leading-tight truncate">
              {t("common.appSubtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {role && (
            <>
              {/* Notifications Bell */}
              <Button
                variant="ghost"
                size="icon"
                className="relative h-auto p-2 hover:bg-primary-foreground/10 border-none"
                onClick={() => setNotificationsOpen(true)}
              >
                <Bell className="h-5 w-5 text-charcol" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>

              {/* Help Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="h-auto p-2 hover:bg-primary-foreground/10 border-none"
                onClick={() => setHelpOpen(true)}
              >
                <HelpCircle className="h-5 w-5 text-charcol" />
              </Button>

              {/* Help Dialog */}
              <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="font-montserrat font-semibold">
                      {t("common.help")}
                    </DialogTitle>
                    <DialogDescription className="font-open-sans">
                      {t("common.helpDescription")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <h4 className="font-montserrat font-semibold text-sm mb-2">
                        {t("common.needSupport")}
                      </h4>
                      <p className="text-sm text-muted-foreground font-open-sans">
                        {t("common.contactSupportMessage")}
                      </p>
                      <p className="text-sm text-primary font-montserrat font-medium mt-2">
                        {t("common.supportContact")}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-montserrat font-semibold text-sm mb-2">
                        {t("common.frequentlyAskedQuestions")}
                      </h4>
                      <p className="text-sm text-muted-foreground font-open-sans">
                        {t("common.faqMessage")}
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Notifications Panel */}
              <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <SheetContent side={dir === "rtl" ? "left" : "right"} className="w-full sm:max-w-md">
                  <SheetHeader>
                    <div className="flex items-center justify-between">
                      <SheetTitle className="font-montserrat font-semibold">
                        {t("common.notifications")}
                      </SheetTitle>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={markAllAsRead}
                          className="text-xs font-open-sans h-auto py-1"
                        >
                          {t("common.markAllAsRead")}
                        </Button>
                      )}
                    </div>
                    <SheetDescription className="font-open-sans">
                      {unreadCount > 0
                        ? `${unreadCount} ${t("common.new")} notification${unreadCount > 1 ? "s" : ""}`
                        : t("common.noNotifications")}
                    </SheetDescription>
                  </SheetHeader>
                  <Separator className="my-4" />
                  <div className="overflow-y-auto h-[calc(100vh-8rem)] pr-2 -mr-2">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                        <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground font-open-sans">
                          {t("common.noNotifications")}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                              !notification.read
                                ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
                                : "bg-background border-border hover:bg-muted/50"
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex gap-3">
                              <div className="mt-0.5 flex-shrink-0">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className="font-montserrat font-semibold text-sm text-foreground">
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground font-open-sans mb-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground/70 font-open-sans">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}          
          {showLanguageToggle && (
            <div className="relative inline-flex h-9 items-center justify-center rounded-full bg-primary/80 p-1 shadow-sm">
              <button
                type="button"
                onClick={() => handleLanguageChange("en")}
                className={`relative flex h-7 items-center justify-center rounded-full px-4 text-sm font-medium transition-all ${
                  language === "en"
                    ? "bg-primary-foreground text-primary shadow-sm"
                    : "text-primary-foreground/70 hover:text-primary-foreground"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange("ar")}
                className={`relative flex h-7 items-center justify-center rounded-full px-4 text-sm font-medium transition-all ${
                  language === "ar"
                    ? "bg-primary-foreground text-primary shadow-sm"
                    : "text-primary-foreground/70 hover:text-primary-foreground"
                }`}
              >
                AR
              </button>
            </div>
          )}
          {role && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto p-2 hover:bg-primary-foreground/10 border-none"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 bg-primary-foreground/20 text-primary-foreground">
                      <AvatarFallback className="text-xs font-montserrat font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-primary text-xs font-open-sans">
                        {t("common.loggedInAs")}
                      </p>
                      <p className="text-primary font-montserrat font-semibold text-sm">
                        {getUserName()}
                      </p>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={dir === "rtl" ? "start" : "end"} className="w-48">
                <DropdownMenuLabel>{t("common.userMenu")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSwitchUser} className="cursor-pointer">
                  <Users className={`h-4 w-4 ${dir === "rtl" ? "ml-2" : "mr-2"}`} />
                  <span>{t("common.switchUser")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className={`h-4 w-4 ${dir === "rtl" ? "ml-2" : "mr-2"}`} />
                  <span>{t("common.logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

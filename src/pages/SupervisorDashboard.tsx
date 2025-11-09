import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/contexts/I18nContext";
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function CommanderDashboard() {
  const navigate = useNavigate();
  const { t } = useI18n();

  // Active card state; default is "pending"
  const [activeCard, setActiveCard] = useState<"pending" | "total" | "approved" | "rejected">("pending");

  const cardData = {
    pending: {
      label: t("commander.dashboard.pendingApprovals"),
      count: 7,
      border: "border-warning",
      icon: <Clock className="w-8 h-8 text-warning" />,
      gradient: "from-warning to-warning/80",
    },
    total: {
      label: t("commander.dashboard.totalRequests"),
      count: 15,
      border: "border-primary",
      icon: <FileText className="w-8 h-8 text-primary" />,
      gradient: "from-primary to-primary/80",
    },
    approved: {
      label: t("commander.dashboard.approvedToday"),
      count: 4,
      border: "border-success",
      icon: <CheckCircle className="w-8 h-8 text-success" />,
      gradient: "from-success to-success/80",
    },
    rejected: {
      label: t("commander.dashboard.rejected"),
      count: 4,
      border: "border-destructive",
      icon: <AlertCircle className="w-8 h-8 text-destructive" />,
      gradient: "from-destructive to-destructive/80",
    },
  };

  const handleCardClick = (status: "pending" | "total" | "approved" | "rejected") => {
    setActiveCard(status);
    const query = status === "total" ? "all" : status;
    navigate(`/commander/approvals?status=${query}`);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="font-montserrat font-bold text-3xl text-primary text-charcoal mb-2">
         {t("supervisor.dashboard.title")}
        </h2>
        <p className="text-muted-foreground font-open-sans">
          {t("supervisor.dashboard.subtitle")}
        </p>
      </div>

      {/* First Row Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 auto-rows-fr">
        {(["pending", "total", "approved", "rejected"] as const).map((key) => {
          const card = cardData[key];
          const isActive = key === activeCard;

          return (
            <Card
              key={key}
              onClick={() => handleCardClick(key)}
              className={`p-6 border-l-4 cursor-pointer transition h-full
                ${card.border}
                ${isActive ? "shadow-lg" : "hover:shadow-md"}
              `}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-foreground font-open-sans mb-1">{card.label}</p>
                  <p className="text-3xl font-montserrat font-bold text-charcoal">{card.count}</p>
                </div>
                {card.icon}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Active Card Info */}
        <Card className="rounded-2xl border shadow-sm p-6 text-primary-foreground bg-gradient-to-br from-primary/80 to-primary/90"
  style={{
    backgroundImage: "url('/approvalimage.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}>
          <div className="flex items-start justify-between mb-4">
            <div>
           <h3 className="font-montserrat font-semibold text-xl mb-2">Approvals Review</h3>
              <p className="font-open-sans text-foreground-primary mb-4">
              Approvals Review ensures every request is checked for accuracy and completeness. Timely reviews help maintain smooth workflows and prevent delays. By approving the right items, you keep projects and operations on track.
              </p> 
            </div>
            <div className="mb-8 w-12 h-12 bg-charcoal/10 rounded-full flex items-center justify-center">
            
            </div>
          </div>

          {/* BUTTON GOES TO APPROVALS WITH FILTER */}
          <Button
            onClick={() => navigate(`/commander/approvals?status=${activeCard === "total" ? "all" : activeCard}`)}
            className="w-full bg-charcoal text-primary-foreground hover:bg-charcoal/90 font-montserrat text-lg font-semibold"
          >
            {t("commander.dashboard.reviewApprovals")}
          </Button>
        </Card>

        {/* Right Card: Recent Decisions */}
        <Card className="p-6 h-full">
          <h3 className="font-montserrat font-semibold text-xl mb-6">{t("supervisor.dashboard.recentactivity")}</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="w-2 h-2 rounded-full bg-success mt-2" />
              <div className="flex-1">
                <p className="font-montserrat font-semibold text-charcoal">
                  {t("activities.desktopPhoneApprovedCommander")}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("officer.name")} - REQ-2025-001247
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  15 {t("activities.minutesAgo").replace("{{count}}", "15")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="w-2 h-2 rounded-full bg-success mt-2" />
              <div className="flex-1">
                <p className="font-montserrat font-semibold text-charcoal">
                  {t("activities.networkAccessApproved")}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                 User Name2 - REQ-2025-001246
                </p>
                <p className="text-xs text-muted-foreground mt-1">{t("activities.hourAgoOne")}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-destructive mt-2" />
              <div className="flex-1">
                <p className="font-montserrat font-semibold text-charcoal">
                  {t("activities.laptopRequestRejected")}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  User Name3 - REQ-2025-001245
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  2 {t("activities.hourAgo").replace("{{count}}", "2")}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

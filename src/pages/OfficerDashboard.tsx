import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/contexts/I18nContext";
import { Phone, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function OfficerDashboard() {
  const navigate = useNavigate();
  const { t } = useI18n();

  
const count = JSON.parse(localStorage.getItem('requestCountsOfficer')) ||{
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0
};;

  return (
    <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="font-montserrat font-bold text-3xl text-primary mb-2">
            {t("officer.dashboard.myRequestsDashboard")}
          </h2>
          <p className="text-muted-foreground font-open-sans">
            {t("officer.dashboard.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           <Card className="p-6 border-l-4 border-primary">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-foreground font-open-sans mb-1">{t("officer.dashboard.inProgress")}</p>
                <p className="text-3xl font-montserrat font-bold text-charcoal">{count.total}</p>
              </div>
              <Phone className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-warning">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-foreground font-open-sans mb-1">{t("officer.dashboard.awaitingApproval")}</p>
                <p className="text-3xl font-montserrat font-bold text-charcoal">{count.approved}</p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-success">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-foreground font-open-sans mb-1">{t("officer.dashboard.completedThisWeek")}</p>
                <p className="text-3xl font-montserrat font-bold text-charcoal">{count.pending}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-destructive">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-foreground font-open-sans mb-1">{t("officer.dashboard.slaBreaches")}</p>
                <p className="text-3xl font-montserrat font-bold text-charcoal">0</p>
              </div>
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
          </Card>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-montserrat font-semibold text-xl mb-6">{t("officer.dashboard.recentActivity")}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="w-2 h-2 rounded-full bg-success mt-2" />
                <div className="flex-1">
                  <p className="font-montserrat font-semibold text-charcoal">{t("activities.requestApprovedByCommander")}</p>
                  <p className="text-sm text-muted-foreground mt-1">REQ-00841 - {t("activities.approvedByCommander")}</p>
                  <p className="text-xs text-muted-foreground mt-1">2 {t("activities.daysAgo").replace("{{count}}", "2")}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="w-2 h-2 rounded-full bg-success mt-2" />
                <div className="flex-1">
                  <p className="font-montserrat font-semibold text-charcoal">{t("activities.voipExtensionProvisioned")}</p>
                  <p className="text-sm text-muted-foreground mt-1">EXT-44129 - {t("activities.extensionProvisioned")}</p>
                  <p className="text-xs text-muted-foreground mt-1">3 {t("activities.daysAgo").replace("{{count}}", "3")}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-warning mt-2" />
                <div className="flex-1">
                  <p className="font-montserrat font-semibold text-charcoal">{t("activities.laptopRequestInReview")}</p>
                  <p className="text-sm text-muted-foreground mt-1">REQ-2025-004198 - {t("activities.awaitingApproval")}</p>
                  <p className="text-xs text-muted-foreground mt-1">5 {t("activities.daysAgo").replace("{{count}}", "5")}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border shadow-sm p-6 text-primary-foreground bg-gradient-to-br from-primary/80 to-primary/90"
  style={{
    backgroundImage: "url('/sercatimage.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}>
            <h3 className="font-montserrat font-semibold text-xl mb-4">{t("officer.dashboard.requestNewService")}</h3>
            <p className="font-open-sans mb-6 text-primary-foreground font-bold">
              Access the service catalog to quickly request equipment, system access, or IT support. Submit your needs through the portal to ensure they are tracked and handled efficiently. The catalog provides a central location for all IT services and resources. Requests are routed to the right team so you get timely assistance every time.
            </p>
            <Button
              onClick={() => navigate("/service-catalog")}
              className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-montserrat font-semibold text-lg"
            >
              {t("officer.dashboard.openServiceCatalog")}
            </Button>
          </Card>
        </div>
      </div>
  );
}

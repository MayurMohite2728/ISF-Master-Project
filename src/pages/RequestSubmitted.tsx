import { useNavigate ,useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/contexts/I18nContext";
import { useUser } from "@/contexts/UserContext";
import { CheckCircle } from "lucide-react";

export default function RequestSubmitted() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user } = useUser();

    const location = useLocation();


   const processResult = location.state?.processResult;

  const getDashboardRoute = () => {
    if (user?.role === "supervisor") return "/supervisor/dashboard";
    return "/officer/dashboard";
  };

  const getUserName = () => {
    if (user?.role === "supervisor") return t("supervisor.name");
    return t("officer.name");
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
          </div>

          <h2 className="font-montserrat font-bold text-2xl text-charcoal mb-4">
            {t("requestSubmitted.title")}
          </h2>

          <p className="text-muted-foreground font-open-sans mb-8">
            {t("requestSubmitted.message")}
          </p>

          <div className="bg-secondary p-6 rounded-lg mb-8 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground font-open-sans mb-1">{t("requestSubmitted.requestId")}</p>
                <p className="font-montserrat font-semibold text-charcoal">{processResult?.processInstanceKey}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-open-sans mb-1">{t("requestSubmitted.serviceType")}</p>
                <p className="font-montserrat font-semibold text-charcoal">{t("serviceCatalog.desktopPhone.title")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-open-sans mb-1">{t("requestSubmitted.requestor")}</p>
                <p className="font-montserrat font-semibold text-charcoal">{getUserName()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-open-sans mb-1">{t("common.status")}</p>
                <p className="font-montserrat font-semibold text-warning">{t("requestSubmitted.pendingApproval")}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(getDashboardRoute())}
              className="flex-1 font-montserrat"
            >
              {t("requestSubmitted.returnToDashboard")}
            </Button>
            <Button
              onClick={() => navigate("/request/status")}
              className="flex-1 font-montserrat font-semibold"
            >
              {t("requestSubmitted.trackStatus")}
            </Button>
          </div>
        </Card>
      </div>
  );
}

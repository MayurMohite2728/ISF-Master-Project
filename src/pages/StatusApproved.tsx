import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusTracker } from "@/components/StatusTracker";
import { useI18n } from "@/contexts/I18nContext";

export default function StatusApproved() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const steps = [
    {
      label: t("requestStatus.statusSteps.commanderApproval"),
      details: t("commander.name"),
      timestamp: "15:04",
      status: "completed" as const,
    },
    {
      label: t("requestStatus.statusSteps.itsmTicketCreated"),
      details: "INC-2025-004216",
      timestamp: "15:07",
      status: "completed" as const,
    },
    {
      label: t("requestStatus.statusSteps.warehouseAllocation"),
      details: "WH-ORD-31872",
      timestamp: "15:10",
      status: "completed" as const,
    },
    {
      label: t("requestStatus.statusSteps.voipProvisioning"),
      details: "EXT-44129 Assigned",
      timestamp: "15:18",
      status: "completed" as const,
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/officer/dashboard")}
          className="mb-4"
        >
          {t("statusApproved.backToDashboard")}
        </Button>

        <Card className="p-6 mb-6 bg-success/5 border-success">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-success-foreground"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-montserrat font-bold text-xl text-charcoal mb-2">
                {t("statusApproved.title")}
              </h2>
              <p className="text-muted-foreground font-open-sans mb-4">
                {t("statusApproved.message")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded border">
                  <p className="text-xs text-muted-foreground font-open-sans mb-1">
                    {t("statusApproved.voipExtension")}
                  </p>
                  <p className="font-montserrat font-bold text-2xl text-primary">EXT-44129</p>
                  <p className="text-sm text-muted-foreground font-open-sans mt-1">
                    +974 4412 9129
                  </p>
                </div>
                <div className="bg-card p-4 rounded border">
                  <p className="text-xs text-muted-foreground font-open-sans mb-1">{t("statusApproved.phoneModel")}</p>
                  <p className="font-montserrat font-bold text-xl text-charcoal">Cisco 8841</p>
                  <p className="text-sm text-muted-foreground font-open-sans mt-1">
                    Building 3, Room 214
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="mb-6">
          <h3 className="font-montserrat font-semibold text-xl text-charcoal mb-2">
            {t("statusApproved.provisioningTimeline")}
          </h3>
          <p className="text-muted-foreground font-open-sans">
            {t("statusApproved.timelineSubtitle")}
          </p>
        </div>

        <StatusTracker steps={steps} />

        <Card className="p-6 mt-6">
          <h3 className="font-montserrat font-semibold text-lg mb-4">{t("statusApproved.nextSteps")}</h3>
          <ul className="space-y-3 font-open-sans text-charcoal">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>{t("statusApproved.step1")}</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>{t("statusApproved.step2")}</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>
                {t("statusApproved.step3")}
              </span>
            </li>
          </ul>
        </Card>

        <div className="flex gap-4 mt-6">
          <Button
            onClick={() => navigate("/officer/dashboard")}
            className="flex-1 font-montserrat font-semibold"
          >
            {t("statusApproved.returnToDashboard")}
          </Button>
        </div>
      </div>
  );
}

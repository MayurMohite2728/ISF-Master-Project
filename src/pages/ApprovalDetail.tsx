import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/contexts/I18nContext";
import { CheckCircle, XCircle } from "lucide-react";

export default function ApprovalDetail() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejection, setShowRejection] = useState(false);

  const handleApprove = () => {
    navigate("/request/status-approved");
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      navigate("/commander/approvals");
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/commander/approvals")}
          className="mb-4"
        >
          {t("approvalDetail.backToInbox")}
        </Button>

        <div className="mb-6">
          <h2 className="font-montserrat font-bold text-2xl text-charcoal mb-2">
            {t("approvalDetail.title")}
          </h2>
          <p className="text-muted-foreground font-open-sans">
            {t("approvalDetail.subtitle")}
          </p>
        </div>

        <Card className="p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-xs text-muted-foreground font-open-sans mb-1">{t("approvalDetail.requestId")}</p>
              <p className="font-montserrat font-semibold text-xl text-primary">
                REQ-2025-001247
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-open-sans mb-1">{t("approvalDetail.serviceType")}</p>
              <p className="font-montserrat font-semibold text-xl text-charcoal">
                {t("serviceCatalog.desktopPhone.title")}
              </p>
            </div>
          </div>

          <div className="border-t pt-6 mb-8">
            <h3 className="font-montserrat font-semibold text-lg mb-4">{t("approvalDetail.requestorInformation")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground font-open-sans mb-1">{t("approvalDetail.name")}</p>
                <p className="font-montserrat font-semibold text-charcoal">
                  {t("officer.name")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-open-sans mb-1">{t("approvalDetail.badgeNumber")}</p>
                <p className="font-montserrat font-semibold text-charcoal">{t("officer.badgeNumber")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-open-sans mb-1">{t("approvalDetail.unit")}</p>
                <p className="font-montserrat font-semibold text-charcoal">
                  {t("officer.unit")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-open-sans mb-1">{t("approvalDetail.location")}</p>
                <p className="font-montserrat font-semibold text-charcoal">
                  {t("officer.location")}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-montserrat font-semibold text-lg mb-4">{t("approvalDetail.requestDetails")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground font-open-sans mb-1">{t("approvalDetail.phoneModel")}</p>
                <p className="font-montserrat font-semibold text-charcoal">Cisco 8841</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-open-sans mb-1">
                  {t("approvalDetail.workstationLocation")}
                </p>
                <p className="font-montserrat font-semibold text-charcoal">
                  Building 3, Room 214, Desk 8
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-muted-foreground font-open-sans mb-1">
                  {t("approvalDetail.justification")}
                </p>
                <p className="font-open-sans text-charcoal">
                  Current phone equipment malfunctioning. Requires replacement for operational
                  communications within Field Operations unit.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {!showRejection ? (
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowRejection(true)}
              className="flex-1 font-montserrat border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <XCircle className="w-4 h-4 mr-2" />
              {t("approvalDetail.rejectRequest")}
            </Button>
            <Button
              onClick={handleApprove}
              className="flex-1 font-montserrat font-semibold bg-success hover:bg-success/90"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {t("approvalDetail.approveRequest")}
            </Button>
          </div>
        ) : (
          <Card className="p-6 border-destructive">
            <h3 className="font-montserrat font-semibold text-lg mb-4 text-destructive">
              {t("approvalDetail.rejectionJustification")}
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rejection" className="font-montserrat font-semibold">
                  {t("approvalDetail.rejectionReason")}
                </Label>
                <Textarea
                  id="rejection"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder={t("approvalDetail.rejectionPlaceholder")}
                  rows={4}
                  className="mt-2"
                />
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowRejection(false)}
                  className="flex-1 font-montserrat"
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 font-montserrat font-semibold bg-destructive hover:bg-destructive/90"
                >
                  {t("approvalDetail.confirmRejection")}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
  );
}

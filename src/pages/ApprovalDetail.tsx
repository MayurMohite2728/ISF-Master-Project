import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/contexts/I18nContext";
import { CheckCircle, XCircle } from "lucide-react";

export default function ApprovalDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();

  // 🧩 Get the task object passed from ApprovalsInbox
  const task = location.state?.request;

  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejection, setShowRejection] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fallback data from localStorage (only used if nothing is passed)
  const storedRequests = JSON.parse(localStorage.getItem("requests") || "[]");
  const manager = storedRequests?.[0]?.managerId || "Jasmine";
  const requestDetails = storedRequests?.[0] || {};

  if (!task) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No task details found.</p>
          <Button className="mt-4" onClick={() => navigate("/commander/approvals")}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  // 🧾 Extract dummy or API details
  const details = task.details || {};

  const {
    requestedBy,
    requestType,
    description,
    adminDecision,
    request,
    managerComments,
    managerApproved,
  } = details;

  // ✅ Approve handler (API call retained)
  const handleApprove = async () => {
    if (!task?.userTaskKey) {
      alert("No task key found!");
      return;
    }

    try {
      setLoading(true);

      const body = {
        variables: {
          approval: true,
          managerComments: "Approved",
        },
      };

      const response = await fetch(`/camunda/v2/user-tasks/${task.userTaskKey}/completion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Task approved successfully:", data);

      alert("Request approved successfully!");
      navigate("/commander/approvals");
    } catch (error) {
      console.error("❌ Error approving task:", error);
      alert("Failed to approve the task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reject handler (API call retained)
  const handleReject = async () => {
    if (!rejectionReason.trim() || !task?.userTaskKey) return;

    try {
      setLoading(true);

      const body = {
        variables: {
          approval: false,
          managerComments: rejectionReason,
        },
      };

      const response = await fetch(`/camunda/v2/user-tasks/${task.userTaskKey}/completion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Task rejected successfully:", data);

      alert("Request rejected successfully.");
      navigate("/commander/approvals");
    } catch (error) {
      console.error("❌ Error rejecting task:", error);
      alert("Failed to reject the task. Please try again.");
    } finally {
      setLoading(false);
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

      {/* 🧾 Task Info */}
      <Card className="p-8 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-xs text-muted-foreground font-open-sans mb-1">Task ID</p>
            <p className="font-montserrat font-semibold text-xl text-primary">
              {task.id || task.userTaskKey}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-open-sans mb-1">Process Name</p>
            <p className="font-montserrat font-semibold text-xl text-charcoal">
              {task.processName || "IT Request Workflow"}
            </p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-montserrat font-semibold text-lg mb-4">Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Requestor Name</p>
              <p className="font-montserrat font-semibold text-charcoal">
                { details.requestedBy || "Not found"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Request Type</p>
              <p className="font-montserrat font-semibold text-charcoal">
                {requestType || requestDetails.phone_model || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Description</p>
              <p className="font-montserrat font-semibold text-charcoal">
                {description || requestDetails.justification || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Decision Type</p>
              <p className="font-montserrat font-semibold text-charcoal">
                {adminDecision || "N/A"}
              </p>
            </div>
            {managerComments && (
              <div className="md:col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Manager Comments</p>
                <p className="font-montserrat font-semibold text-charcoal">
                  {managerComments}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 🧩 Actions */}
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
            disabled={loading}
            className="flex-1 font-montserrat font-semibold bg-success hover:bg-success/90"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {loading ? "Approving..." : t("approvalDetail.approveRequest")}
          </Button>
        </div>
      ) : (
        <Card className="p-6 border-destructive mt-6">
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
                disabled={loading || !rejectionReason.trim()}
                className="flex-1 font-montserrat font-semibold bg-destructive hover:bg-destructive/90"
              >
                {loading ? "Rejecting..." : t("approvalDetail.confirmRejection")}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

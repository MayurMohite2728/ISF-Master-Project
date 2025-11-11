import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/contexts/I18nContext";
import { useUser } from "@/contexts/UserContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function PhoneRequestForm() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user } = useUser();

  const [phoneModel, setPhoneModel] = useState("");
  const [workstation, setWorkstation] = useState("");
  const [justification, setJustification] = useState("");
  const [loading, setLoading] = useState(false);

  // Utility functions for user data
  const getUserName = () => {
    if (user?.role === "supervisor") return t("supervisor.name");
    return t("officer.name");
  };

  const getUserBadge = () => {
    if (user?.role === "supervisor") return "ISF-SUP-001";
    return t("officer.badgeNumber");
  };

  const getUserUnit = () => {
    if (user?.role === "supervisor")
      return "Internal Security Division – Supervision";
    return t("officer.unit");
  };

  const getUserLocation = () => {
    if (user?.role === "supervisor") return "Doha HQ – Building 2, Room 305";
    return t("officer.location");
  };

  // 🧠 Main Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // STEP 1️⃣: Get Access Token (Optional if your backend requires it)
      const tokenResponse = await fetch(
        "https://login.cloud.camunda.io/oauth/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grant_type: "client_credentials",
            audience: "zeebe.camunda.io",
            client_id: "GcWK5wakmOIIzAraE9avJKboVCgNY9yq",
            client_secret:
              "fmhxf6DVgzDVfphJxqdr1vK0l7ArvqW4YlVBkcw7SGKstzK-uP2QLQr1GQqbKGRR",
          }),
        }
      );

      if (!tokenResponse.ok) {
        throw new Error("Failed to fetch access token");
      }

      //const tokenData = await tokenResponse.json();
      //const accessToken = tokenData.access_token;

      // STEP 2️⃣: Start Camunda Process
      const processBody = {
        processDefinitionId: "new-it-request-workflow",
        variables: {
          requestedBy: getUserName(),
          managerId: "Jasmine",
          requestType: "network",
          request: `${phoneModel}`,
          description: `${justification}`,
          approval: null,
          adminDecision: null,
          adminComments: "",
          userConfirmed: false,
        },
      };

      const processResponse = await fetch("/camunda/v2/process-instances", {
        method: "POST",
        headers: {
          //"Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processBody),
      });

      if (!processResponse.ok) {
        throw new Error(`Process start failed: ${processResponse.status}`);
      }

      const processResult = await processResponse.json();
      console.log("✅ Process started successfully:", processResult);

      // STEP 3️⃣: Create a Request Object
      const newRequest = {
        // id: Date.now().toString(),
        requestor_name: getUserName(),
        current_status: "SUBMITTED",
        badge_number: getUserBadge(),
        submitted_date: new Date().toISOString(),
        phone_model: phoneModel,
        workstation,
        justification,
      };

      // STEP 4️⃣: Merge API Response with Request Data
      const combinedRequest = {
        ...newRequest,
        processInstanceKey: processResult.processInstanceKey,
        processDefinitionId: processResult.processDefinitionId,
        processDefinitionVersion: processResult.processDefinitionVersion,
        tenantId: processResult.tenantId,
      };

      // STEP 5️⃣: Save to localStorage
      const existingRequests =
        JSON.parse(localStorage.getItem("requests")) || [];
      existingRequests.push(combinedRequest);
      localStorage.setItem("requests", JSON.stringify(existingRequests));

      console.log("📦 Request saved with process info:", combinedRequest);

      // STEP 6️⃣: Navigate on success
      navigate("/request/submitted", { state: { processResult } });
    } catch (error) {
      console.error("❌ Error submitting request:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🧱 JSX Layout
  return (
    <div className="container mx-auto px-6 py-8 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/service-catalog")}
        className="mb-4"
      >
        {t("phoneRequest.backToCatalog")}
      </Button>

      <Card className="p-8">
        <div className="mb-6">
          <h2 className="font-montserrat font-bold text-2xl text-charcoal mb-2">
            {t("phoneRequest.title")}
          </h2>
          <p className="text-muted-foreground font-open-sans">
            {t("phoneRequest.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Requestor Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-secondary rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground font-open-sans mb-1">
                {t("phoneRequest.requestorName")}
              </p>
              <p className="font-montserrat font-semibold text-charcoal">
                {getUserName()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-open-sans mb-1">
                {t("phoneRequest.badgeNumber")}
              </p>
              <p className="font-montserrat font-semibold text-charcoal">
                {getUserBadge()}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-muted-foreground font-open-sans mb-1">
                {t("phoneRequest.unit")}
              </p>
              <p className="font-montserrat font-semibold text-charcoal">
                {getUserUnit()}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-muted-foreground font-open-sans mb-1">
                {t("phoneRequest.location")}
              </p>
              <p className="font-montserrat font-semibold text-charcoal">
                {getUserLocation()}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-2">
            <Label
              htmlFor="phoneModel"
              className="font-montserrat font-semibold"
            >
              {t("phoneRequest.phoneModelRequired")}
            </Label>
            <Select value={phoneModel} onValueChange={setPhoneModel} required>
              <SelectTrigger id="phoneModel">
                <SelectValue placeholder={t("phoneRequest.selectPhoneModel")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cisco-8841">Cisco 8841</SelectItem>
                <SelectItem value="cisco-7821">Cisco 7821</SelectItem>
                <SelectItem value="avaya-9608">Avaya 9608</SelectItem>
                <SelectItem value="standard-voip">
                  Standard VoIP Desk Phone
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="workstation"
              className="font-montserrat font-semibold"
            >
              {t("phoneRequest.workstationRequired")}
            </Label>
            <Input
              id="workstation"
              type="text"
              value={workstation}
              onChange={(e) => setWorkstation(e.target.value)}
              placeholder={t("phoneRequest.workstationPlaceholder")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="justification"
              className="font-montserrat font-semibold"
            >
              {t("phoneRequest.justification")}
            </Label>
            <Textarea
              id="justification"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder={t("phoneRequest.justificationPlaceholder")}
              rows={4}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/service-catalog")}
              className="flex-1 font-montserrat"
              disabled={loading}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              className="flex-1 font-montserrat font-semibold"
              disabled={loading}
            >
              {loading
                ? t("phoneRequest.submitting")
                : t("phoneRequest.submitRequest")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// RequestStatus.tsx
import { useState, useMemo, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusTracker } from "@/components/StatusTracker";
import { useI18n } from "@/contexts/I18nContext";
import { useUser } from "@/contexts/UserContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface Request {
  id: string;
  serviceType: string;
  status: "pending" | "inProgress" | "approved" | "rejected" | "completed";
  submittedDate: string;
  phoneModel?: string;
  location?: string;
  justification?: string;
}

// ---------------- MOCK DATA ----------------
const mockRequests: Request[] = [
  {
    id: "REQ-2025-001247",
    serviceType: "Desktop Phone",
    status: "inProgress",
    submittedDate: "2025-01-15",
    phoneModel: "Cisco 8841",
    location: "Building 3, Room 214, Desk 8",
    justification: "Required for operational duty station",
  },
  {
    id: "REQ-2025-001235",
    serviceType: "Desktop Phone",
    status: "completed",
    submittedDate: "2025-01-10",
    phoneModel: "Cisco 7821",
    location: "Building 2, Room 101, Desk 3",
    justification: "Replacement for damaged equipment",
  },
  {
    id: "REQ-2025-001198",
    serviceType: "Desktop Phone",
    status: "approved",
    submittedDate: "2025-01-05",
    phoneModel: "Avaya 9608",
    location: "Building 1, Room 305, Desk 12",
    justification: "New workstation setup",
  },
  {
    id: "REQ-2025-001299",
    serviceType: "Desktop Phone",
    status: "rejected",
    submittedDate: "2025-01-20",
    phoneModel: "Polycom 331",
    location: "Building 4, Room 101, Desk 7",
    justification: "Incorrect request details",
  },
];

export default function RequestStatus() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getDashboardRoute = () => {
    if (user?.role === "supervisor") return "/supervisor/dashboard";
    if (user?.role === "admin") return "/admin/dashboard";
    return "/officer/dashboard";
  };

  // ---------------- Collapsed by default ----------------
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const getStatusBadge = (status: Request["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">{t("requestStatus.statusPending")}</Badge>;
      case "inProgress":
        return (
          <Badge variant="default" className="bg-warning text-warning-foreground">
            {t("requestStatus.inProgress")}
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="default" className="bg-success text-success-foreground">
            {t("requestStatus.statusApproved")}
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="default" className="bg-success text-success-foreground">
            {t("requestStatus.statusCompleted")}
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">{t("requestStatus.statusRejected")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return mockRequests;
    const query = searchQuery.toLowerCase().trim();
    return mockRequests.filter((request) => {
      const searchableText = [
        request.id,
        request.serviceType,
        request.status,
        formatDate(request.submittedDate),
        request.phoneModel,
        request.location,
        request.justification,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchableText.includes(query);
    });
  }, [searchQuery]);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRequests.slice(startIndex, endIndex);
  }, [filteredRequests, currentPage]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="container mx-auto px-6 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(getDashboardRoute())}
        className="mb-4"
      >
        {t("requestStatus.backToDashboard")}
      </Button>

      <div className="mb-6">
        <h2 className="font-montserrat font-bold text-3xl text-primary mb-2">{t("requestStatus.title")}</h2>
        <p className="text-muted-foreground">{t("requestStatus.subtitle")}</p>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex justify-end">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("requestStatus.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table className="font-montserrat">
          <TableHeader>
            <TableRow>
              <TableHead className="text-charcol font-bold">{t("requestStatus.requestId")}</TableHead>
              <TableHead  className="text-charcol font-bold">{t("requestStatus.serviceType")}</TableHead>
              <TableHead  className="text-charcol font-bold">{t("requestStatus.currentStatus")}</TableHead>
              <TableHead  className="text-charcol font-bold">{t("requestStatus.submittedDate")}</TableHead>
              <TableHead  className="text-charcol font-bold">{t("requestStatus.action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-foreground">
                  {searchQuery ? t("requestStatus.noResults") : t("requestStatus.noRequests")}
                </TableCell>
              </TableRow>
            ) : (
              paginatedRequests.map((request) => (
                <Fragment key={request.id}>
                  <TableRow className="hover:bg-muted/50">
                    <TableCell className="text-primary font-semibold">{request.id}</TableCell>
                    <TableCell>{request.serviceType}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-sm text-foreground">
                      {formatDate(request.submittedDate)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleRow(request.id)}
                     className="bg-accent text-charcoal font-semibold" >
                        {expandedRows.has(request.id) ? "Hide Details" : "View Details"}
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row */}
                  <TableRow>
                    <TableCell colSpan={5} className="p-0 border-none">
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          expandedRows.has(request.id) ? "max-h-[500px] p-4" : "max-h-0"
                        } bg-gray-50 rounded-lg`}
                      >
                        <div className="space-y-2">
                          <p><strong>Phone Model:</strong> {request.phoneModel}</p>
                          <p><strong>Location:</strong> {request.location}</p>
                          <p><strong>Justification:</strong> {request.justification}</p>

                          {/* Dynamic Status Tracker */}
                          <div className="mt-2">
                            {(() => {
                              const workflowSteps = [
                                { label: "Commander Approval", details: "Commander Name", timestamp: "15:04" },
                                { label: "ITSM Ticket Created", details: "INC-2025-004216", timestamp: "15:07" },
                                { label: "Warehouse Allocation", details: "WH-ORD-31872", timestamp: "15:10" },
                                { label: "VOIP Provisioning", details: "EXT-44129 Assigned", timestamp: "15:18" },
                              ];

                              let overallStatus: "approved" | "pending" | "rejected" = "pending";
                              let currentStepIndex = -1;
                              let rejectedStepIndex = -1;

                              switch (request.status) {
                                case "approved":
                                case "completed":
                                  overallStatus = "approved";
                                  currentStepIndex = workflowSteps.length - 1;
                                  break;
                                case "rejected":
                                  overallStatus = "rejected";
                                  // dynamically pick rejected step (example: step 2 failed)
                                  rejectedStepIndex = 2;
                                  break;
                                case "pending":
                                case "inProgress":
                                  overallStatus = "pending";
                                  // dynamically set current progress (example: step 2 completed)
                                  currentStepIndex = 2;
                                  break;
                              }

                              return (
                                <StatusTracker
                                  steps={workflowSteps}
                                  overallStatus={overallStatus}
                                  currentStepIndex={currentStepIndex}
                                  rejectedStepIndex={rejectedStepIndex}
                                />
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// RequestStatus.jsx
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

// ---------------- MOCK API RESPONSE ----------------
const mockApiResponse = {
  items: [
    {
      id: 1,
      requestor_name: "Nandini",
      current_status: "SUBMITTED",
      badge_number: "ISF-4410",
      submitted_date: "2025-11-05T13:50:00Z",
    },
    {
      id: 2,
      requestor_name: "Sara Khan",
      current_status: "IN_PROGRESS",
      badge_number: "ISF-4411",
      submitted_date: "2025-11-07T10:20:00Z",
    },
    {
      id: 3,
      requestor_name: "John Doe",
      current_status: "APPROVED",
      badge_number: "ISF-4412",
      submitted_date: "2025-11-02T09:15:00Z",
    },
    {
      id: 4,
      requestor_name: "Jane Smith",
      current_status: "REJECTED",
      badge_number: "ISF-4413",
      submitted_date: "2025-10-30T08:40:00Z",
    },
  ],
  page: 1,
  page_size: 20,
  total: 4,
};

export default function RequestStatus() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const itemsPerPage = 5;

  const getDashboardRoute = () => {
    if (user?.role === "supervisor") return "/supervisor/dashboard";
    if (user?.role === "admin") return "/admin/dashboard";
    return "/officer/dashboard";
  };

  useEffect(() => {
    const fetchRequests = async () => {
      // 1️⃣ Simulate API data
      const apiData = mockApiResponse.items.map((item) => ({
        id: item.id.toString(),
        requestorName: item.requestor_name,
        status: item.current_status.toLowerCase(),
        badgeNumber: item.badge_number,
        submittedDate: item.submitted_date,
      }));

      // 2️⃣ Get locally stored requests
      const localData =
        JSON.parse(localStorage.getItem("requests"))?.map((item) => ({
          id: item.id.toString(),
          requestorName: item.requestor_name,
          status: item.current_status.toLowerCase(),
          badgeNumber: item.badge_number,
          submittedDate: item.submitted_date,
        })) || [];

      // 3️⃣ Merge all requests
      const allRequests = [...localData, ...apiData];

      // 4️⃣ Filter only requests from current logged-in user
      const currentUserName =
        user?.name || user?.username || user?.fullName || "";
      const userRequests = allRequests.filter(
        (r) => r.requestorName?.toLowerCase() === currentUserName?.toLowerCase()
      );

      // 5️⃣ Update state
      setRequests(userRequests);
    };

    if (user) fetchRequests();
  }, [user]);

  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "submitted":
        return (
          <Badge variant="outline">
            {t("requestStatus.statusPending") || "Submitted"}
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="default"
            className="bg-warning text-warning-foreground"
          >
            {t("requestStatus.inProgress") || "In Progress"}
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="default"
            className="bg-success text-success-foreground"
          >
            {t("requestStatus.statusApproved") || "Approved"}
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="default"
            className="bg-success text-success-foreground"
          >
            {t("requestStatus.statusCompleted") || "Completed"}
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            {t("requestStatus.statusRejected") || "Rejected"}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return requests;
    const query = searchQuery.toLowerCase().trim();
    return requests.filter((r) =>
      [r.id, r.requestorName, r.status, r.badgeNumber]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [searchQuery, requests]);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, currentPage]);

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
        {t("requestStatus.backToDashboard") || "Back to Dashboard"}
      </Button>

      <div className="mb-6">
        <h2 className="font-montserrat font-bold text-3xl text-primary mb-2">
          {t("requestStatus.title") || "Request Status"}
        </h2>
        <p className="text-muted-foreground">
          {t("requestStatus.subtitle") ||
            "Track the current progress of your submitted requests."}
        </p>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex justify-end">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={
                t("requestStatus.searchPlaceholder") ||
                "Search by ID, name, or badge"
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table className="font-montserrat">
          <TableHeader>
            <TableRow>
              <TableHead className="text-charcol font-bold">
                Request ID
              </TableHead>
              <TableHead className="text-charcol font-bold">
                Requestor
              </TableHead>
              <TableHead className="text-charcol font-bold">
                Badge Number
              </TableHead>
              <TableHead className="text-charcol font-bold">Status</TableHead>
              <TableHead className="text-charcol font-bold">
                Submitted Date
              </TableHead>
              <TableHead className="text-charcol font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRequests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-foreground"
                >
                  {t("requestStatus.noResults") || "No requests found."}
                </TableCell>
              </TableRow>
            ) : (
              paginatedRequests.map((r) => (
                <Fragment key={r.id}>
                  <TableRow className="hover:bg-muted/50">
                    <TableCell className="text-primary font-semibold">
                      {r.id}
                    </TableCell>
                    <TableCell>{r.requestorName}</TableCell>
                    <TableCell>{r.badgeNumber}</TableCell>
                    <TableCell>{getStatusBadge(r.status)}</TableCell>
                    <TableCell className="text-sm text-foreground">
                      {formatDate(r.submittedDate)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleRow(r.id)}
                        className="bg-accent text-charcoal font-semibold"
                      >
                        {expandedRows.has(r.id)
                          ? "Hide Details"
                          : "View Details"}
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Collapsible Details */}
                  <TableRow>
                    <TableCell colSpan={6} className="p-0 border-none">
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out bg-gray-50 rounded-lg ${
                          expandedRows.has(r.id)
                            ? "max-h-[500px] p-4 opacity-100"
                            : "max-h-0 p-0 opacity-0"
                        }`}
                      >
                        {expandedRows.has(r.id) && (
                          <div className="space-y-2">
                            <p>
                              <strong>Requestor:</strong> {r.requestorName}
                            </p>
                            <p>
                              <strong>Badge:</strong> {r.badgeNumber}
                            </p>

                            <div className="mt-2">
                              {(() => {
                                const workflowSteps = [
                                  {
                                    label: "Commander Approval",
                                    details: "Commander Verified",
                                    timestamp: "15:04",
                                  },
                                  {
                                    label: "Ticket Creation",
                                    details: "INC-2025-004216",
                                    timestamp: "15:07",
                                  },
                                  {
                                    label: "Asset Allocation",
                                    details: "WH-ORD-31872",
                                    timestamp: "15:10",
                                  },
                                  {
                                    label: "Provisioning",
                                    details: "EXT-44129 Assigned",
                                    timestamp: "15:18",
                                  },
                                ];

                                let overallStatus = "pending";
                                let currentStepIndex = -1;
                                let rejectedStepIndex = -1;

                                switch (r.status) {
                                  case "approved":
                                  case "completed":
                                    overallStatus = "approved";
                                    currentStepIndex = workflowSteps.length - 1;
                                    break;
                                  case "rejected":
                                    overallStatus = "rejected";
                                    rejectedStepIndex = 2;
                                    break;
                                  case "in_progress":
                                  case "submitted":
                                    overallStatus = "pending";
                                    currentStepIndex = 1;
                                    break;
                                  default:
                                    overallStatus = "pending";
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
                        )}
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

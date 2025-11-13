import { useState, useMemo, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusTracker } from "@/components/StatusTracker";
import { useI18n } from "@/contexts/I18nContext";
import { useUser } from "@/contexts/UserContext";
// import { useApproval } from "@/contexts/ApprovalContext";
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

export default function RequestStatus() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user } = useUser();
  // const { setTasks } = useApproval();

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

  // ⭐ MAIN FETCH LOGIC (REAL APIs)
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // -----------------------------
        // 1️⃣ Fetch Process Instances
        // -----------------------------
        const getProcessInstance = await fetch(
          "https://mocki.io/v1/fda0ef79-0f80-4734-b61b-2f49f5f9e876",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({
            //   filter: {
            //     processDefinitionId: "it_request_workflow",
            //     processDefinitionVersionTag: "final",
            //   },
            // }),
          }
        );

        const api1Json = await getProcessInstance.json(); // ✔ Correct
        const instances = api1Json.items || [];

        const merged = await Promise.all(
          instances.map(async (inst) => {
            const api2 = await fetch(
              "https://mp0089b2cfab2685a6c9.free.beeceptor.com/v2/variables/search",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  filter: { processInstanceKey: inst.processInstanceKey },
                }),
              }
            );

            const api2Json = await api2.json();

            const details = (api2Json.items || []).reduce((acc, item) => {
              acc[item.name] = item.value?.replaceAll('"', "");
              return acc;
            }, {});

            return {
              id: inst.processInstanceKey,
              requestorName: details.requestedBy,
              requestType: details.requestType,
              request: details.request,
              description: details.description,
              status: (details.status || "submitted").toLowerCase(),
              submittedDate: inst.startDate,
              badgeNumber: "ISF-064821",
            };
          })
        );

        const currentName =
          user?.name?.toLowerCase() ||
          user?.username?.toLowerCase() ||
          user?.fullName?.toLowerCase() ||
          "";

        const filtered = merged.filter(
          (r) =>
            r.requestorName && r.requestorName.toLowerCase() === currentName
        );

        setRequests(filtered);

        // 4️⃣ Count status for dashboard
        const counts = {
          total: filtered.length,
          pending: filtered.filter(
            (r) => r.status === "submitted" || r.status === "pending"
          ).length,
          approved: filtered.filter((r) => r.status === "approved").length,
          rejected: filtered.filter((r) => r.status === "rejected").length,
        };

        // 5️⃣ Save in localStorage
        localStorage.setItem("requestCountsOfficer", JSON.stringify(counts));
      } catch (error) {
        console.error("❌ Error loading requests:", error);
      }
    };

    if (user) fetchRequests();
  }, [user]);

  // Expand row
  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  // Status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "submitted":
        return <Badge variant="outline">Submitted</Badge>;
      case "approved":
        return <Badge className="bg-success text-white">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-destructive text-white">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Search
  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return requests;
    const q = searchQuery.toLowerCase();
    return requests.filter((r) =>
      [r.id, r.requestorName, r.status].join(" ").toLowerCase().includes(q)
    );
  }, [searchQuery, requests]);

  // Pagination
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(start, start + itemsPerPage);
  }, [filteredRequests, currentPage]);

  return (
    <div className="container mx-auto px-6 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(getDashboardRoute())}
        className="mb-4"
      >
        Back to Dashboard
      </Button>

      <div className="mb-6">
        <h2 className="font-montserrat font-bold text-3xl text-primary">
          Request Status
        </h2>
        <p className="text-muted-foreground">
          View all requests you have submitted.
        </p>
      </div>

      <Card className="p-6">
        {/* Search Bar */}
        <div className="mb-4 flex justify-end">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table className="font-montserrat">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Requestor</TableHead>
              <TableHead>Badge</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No matching records
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((r) => (
                <Fragment key={r.id}>
                  <TableRow>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.requestorName}</TableCell>
                    <TableCell>{r.badgeNumber}</TableCell>
                    <TableCell>{getStatusBadge(r.status)}</TableCell>
                    <TableCell>{formatDate(r.submittedDate)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleRow(r.id)}
                      >
                        {expandedRows.has(r.id)
                          ? "Hide Details"
                          : "View Details"}
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Expanded details */}
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div
                        className={`transition-all ${
                          expandedRows.has(r.id)
                            ? "max-h-[300px] p-4"
                            : "max-h-0 p-0 overflow-hidden"
                        }`}
                      >
                        {expandedRows.has(r.id) && (
                          <div>
                            <p>
                              <strong>Request:</strong> {r.request}
                            </p>
                            <p>
                              <strong>Description:</strong> {r.description}
                            </p>

                            <StatusTracker
                              steps={[
                                { label: "Submitted", details: r.request },
                                { label: "Processing" },
                                { label: "Completed" },
                              ]}
                              overallStatus={r.status}
                              currentStepIndex={
                                r.status === "submitted"
                                  ? 0
                                  : r.status === "approved"
                                  ? 2
                                  : r.status === "rejected"
                                  ? 1
                                  : 0
                              }
                            />
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

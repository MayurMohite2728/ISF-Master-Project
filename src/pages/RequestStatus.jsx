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

// ------------------ DUMMY APIs ------------------

//  Dummy API1: Get all processInstanceKeys
const dummyApi1 = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        items: [
          {
            processInstanceKey: "2251799813763634",
            startDate: "2025-11-12T13:47:37.903Z",
          },
          {
            processInstanceKey: "2251799813763788",
            startDate: "2025-11-10T10:11:22.000Z",
          },
          {
            processInstanceKey: "2251799813763799",
            startDate: "2025-11-09T09:45:00.000Z",
          },
        ],
      });
    }, 400);
  });
};

// 🟢 Dummy API2: Variables for each processInstanceKey
const dummyApi2 = async (processInstanceKey) => {
  const allData = {
    2251799813763634: {
      items: [
        { name: "requestedBy", value: '"Nandini"' },
        { name: "requestType", value: '"network"' },
        { name: "request", value: '"New IP phone installation"' },
        { name: "description", value: '"Need IP phone setup"' },
        { name: "status", value: '"Submitted"' },
      ],
    },
    2251799813763788: {
      items: [
        { name: "requestedBy", value: '"Jasmine"' },
        { name: "requestType", value: '"hardware"' },
        { name: "request", value: '"Laptop Request"' },
        { name: "description", value: '"Laptop required for field ops"' },
        { name: "status", value: '"Approved"' },
      ],
    },
    2251799813763799: {
      items: [
        { name: "requestedBy", value: '"Nandini"' },
        { name: "requestType", value: '"network"' },
        { name: "request", value: '"Network Access"' },
        { name: "description", value: '"Need access to secure VLAN"' },
        { name: "status", value: '"Rejected"' },
      ],
    },
  };

  return new Promise((resolve) =>
    setTimeout(() => resolve(allData[processInstanceKey]), 400)
  );
};

// ------------------------------------------------

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

  // 🧩 Fetch: API1 → API2 → Merge → Filter by user
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // 1️⃣ Call API1 (dummy)

        //    const getProcessInstances = await fetch("/v2/process-instances/search", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     filter: {
        //       processDefinitionId: "it_request_workflow",
        //       processDefinitionVersionTag: "final",
        //     },
        //   }),
        // }).then(res => res.json());

        const api1 = await dummyApi1();

        // 2️⃣ For each processInstanceKey, call API2
        const combined = await Promise.all(
          api1.items.map(async (inst) => {
            const api2 = await dummyApi2(inst.processInstanceKey);

            // Convert API2 array into object
            const details = api2.items.reduce((acc, item) => {
              acc[item.name] = item.value?.replaceAll('"', "");
              return acc;
            }, {});

            // Build final row
            return {
              id: inst.processInstanceKey,
              requestorName: details.requestedBy,
              request: details.request,
              status: details.status?.toLowerCase() || "submitted",
              description: details.description,
              badgeNumber: "ISF-064821",
              submittedDate: inst.startDate,
            };
          })
        );

        // 3️⃣ Filter only current user's records
        const currentUserName =
          user?.name || user?.username || user?.fullName || "";

        const filtered = combined.filter(
          (r) =>
            r.requestorName?.toLowerCase() === currentUserName?.toLowerCase()
        );

        setRequests(filtered);
      } catch (error) {
        console.error("❌ Error loading requests:", error);
      }
    };

    if (user) fetchRequests();
  }, [user]);

  // 🔄 Expand Row Handler
  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  // 🟢 Status Badge Renderer
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // 🔍 Search
  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return requests;
    const query = searchQuery.toLowerCase();
    return requests.filter((r) =>
      [r.id, r.requestorName, r.status, r.badgeNumber]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [searchQuery, requests]);

  // 📄 Pagination
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, currentPage]);

  useEffect(() => setCurrentPage(1), [searchQuery]);

  // -------------------- UI RENDER --------------------
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
        <h2 className="font-montserrat font-bold text-3xl text-primary mb-2">
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
              type="text"
              placeholder="Search by ID, requestor, or status"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <Table className="font-montserrat">
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Requestor</TableHead>
              <TableHead>Badge</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No matching requests.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRequests.map((r) => (
                <Fragment key={r.id}>
                  <TableRow className="hover:bg-muted/50">
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
                        className="font-semibold"
                      >
                        {expandedRows.has(r.id)
                          ? "Hide Details"
                          : "View Details"}
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Expandable Row */}
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div
                        className={`overflow-hidden transition-all duration-300 bg-gray-50 rounded-md ${
                          expandedRows.has(r.id)
                            ? "max-h-[300px] p-4"
                            : "max-h-0 p-0"
                        }`}
                      >
                        {expandedRows.has(r.id) && (
                          <>
                            <p>
                              <strong>Request:</strong> {r.request}
                            </p>
                            <p>
                              <strong>Description:</strong> {r.description}
                            </p>

                            {/* Status Timeline */}
                            <div className="mt-3">
                              <StatusTracker
                                steps={[
                                  {
                                    label: "Submitted",
                                    details: r.request,
                                  },
                                  {
                                    label: "Processing",
                                  },
                                  {
                                    label: "Completed",
                                  },
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
                          </>
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

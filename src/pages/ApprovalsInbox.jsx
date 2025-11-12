import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/contexts/I18nContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export default function ApprovalsInbox({ onCountUpdate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();

  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 6;
  const params = new URLSearchParams(location.search);
  const statusFilter = params.get("status") || "all";
  const { user } = useUser();

  const currentManager = user?.username || "Unknown";

  // ✅ Use Dummy API Response
  useEffect(() => {
    const fetchDummyTasks = async () => {
      setLoading(true);
      try {
        const dummyResponse = {
          items: [
            {
              value: '"Nandini"',
              name: "requestedBy",
              processInstanceKey: "2251799813740297",
            },
            {
              value: '"network"',
              name: "requestType",
              processInstanceKey: "2251799813740297",
            },
            {
              value: '"Needs specialized configuration."',
              name: "adminComments",
              processInstanceKey: "2251799813740297",
            },
            {
              value: '"Jasmine"',
              name: "managerId",
              processInstanceKey: "2251799813740297",
            },
            {
              value: '"New IP phone installation"',
              name: "request",
              processInstanceKey: "2251799813740297",
            },
            {
              value: '"technical"',
              name: "adminDecision",
              processInstanceKey: "2251799813740297",
            },
            {
              value: '"Need IP phone setup for a new employee"',
              name: "description",
              processInstanceKey: "2251799813740297",
            },
            {
              value: "true",
              name: "managerApproved",
              processInstanceKey: "2251799813740297",
            },
            {
              value: '"Approved by Jasmine."',
              name: "managerComments",
              processInstanceKey: "2251799813740297",
            },
          ],
        };

        // 🔹 Convert array to object for easy access
        const dataMap = dummyResponse.items.reduce((acc, item) => {
          acc[item.name] = item.value?.replaceAll('"', "") ?? "N/A";
          acc.processInstanceKey = item.processInstanceKey; // assign once
          return acc;
        }, {});

        console.log("Parsed Dummy Data:", dataMap);

        // formatted data (
        const formatted = [
          {
            id: dataMap.processInstanceKey,
            requestor: dataMap.requestedBy || "Unknown",
            unit: dataMap.requestType || "<default>",
            service: dataMap.request || "N/A",
            priority:
              dataMap.adminDecision === "technical" ? "High" : "Standard",
            submitted: new Date().toLocaleString(),
            status:
              dataMap.managerApproved === "true" ? "Completed" : "Pending",
            details: dataMap,
          },
        ];

        setTasks(formatted);

        //  Count statuses and send to parent (Supervisor Dashboard)

        const counts = {
          pending: formatted.filter((t) => t.status === "Pending").length,
          approved: formatted.filter((t) => t.status === "Completed").length,
          rejected: formatted.filter((t) => t.status === "Rejected").length,
          total: formatted.length,
        };

        onCountUpdate?.(counts); // safely call parent callback
      } catch (error) {
        console.error("❌ Error loading dummy data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDummyTasks();
  }, []);

  // ✅ Filtering
  const filteredApprovals = useMemo(() => {
    let data = [...tasks];

    if (statusFilter !== "all") {
      const statusCapitalized =
        statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
      data = data.filter((a) => a.status === statusCapitalized);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = data.filter((a) =>
        [
          a.id,
          a.requestor,
          a.unit,
          a.service,
          a.priority,
          a.submitted,
          a.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }

    return data;
  }, [tasks, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredApprovals.length / itemsPerPage);
  const paginatedApprovals = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredApprovals.slice(start, start + itemsPerPage);
  }, [filteredApprovals, currentPage]);

  useEffect(() => setCurrentPage(1), [searchQuery, statusFilter]);

  // ✅ Badge helper
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <Badge className="bg-yellow-300 text-yellow-900 font-open-sans">
            {status}
          </Badge>
        );
      case "Completed":
        return (
          <Badge className="bg-green-300 text-green-900 font-open-sans">
            {status}
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-red-300 text-red-900 font-open-sans">
            {status}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-300 text-gray-900 font-open-sans">
            {status}
          </Badge>
        );
    }
  };

  const handleReview = (task) => {
    navigate("/commander/approval-detail", { state: { request: task } });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <h2 className="font-montserrat font-bold text-2xl text-charcoal mb-2">
          {t("approvalsInbox.title")}
        </h2>
        <p className="text-muted-foreground font-open-sans">
          {t("approvalsInbox.subtitle")}
        </p>
      </div>

      <Card className="p-6">
        {/* Search */}
        <div className="mb-4 flex justify-end">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("approvalsInbox.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-open-sans"
            />
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  ⏳ Loading tasks...
                </TableCell>
              </TableRow>
            ) : paginatedApprovals.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No tasks found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedApprovals.map((task) => (
                <TableRow key={task.id} className="hover:bg-muted/50">
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.service}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.submitted}</TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleReview(task)}
                      className="font-montserrat"
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-end">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((p) => Math.max(1, p - 1));
                    }}
                    className={
                      currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                    }}
                    className={
                      currentPage === totalPages
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  );
}

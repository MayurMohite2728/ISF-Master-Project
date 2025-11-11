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

export default function ApprovalsInbox() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();

  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
 

  

  const itemsPerPage = 6;

  // Get filter from URL (?status=pending)
  const params = new URLSearchParams(location.search);
  const statusFilter = params.get("status") || "all"; 

     const { user } = useUser();

  //   const getUserName = () => {
  //   if (user?.role === "supervisor") return t("supervisor.name");
  //   if (user?.role === "officer") return t("officer.name");
  //   if (user?.role === "tech_approver") return t("tech_approver.name");
  //   return "Unknown User";
  // };
     
  const currentManager = user?.username || "Unknown";
    

  // ✅ Fetch tasks from backend API
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const storedRequests = JSON.parse(localStorage.getItem("requests")) || [];
      
        const managerName =
     currentManager && typeof currentManager === "object"
    ? (currentManager as { manager: string }).manager
    : currentManager || "Unknown";

      console.log("✅ Final managerName:", `"${managerName}"`,);
        const requestBody = {
          sort: [{ field: "creationDate", order: "ASC" }],
          filter: {
            state: "CREATED",
            localVariables: [
              {
                name: "assignee",
                value: `"${managerName}"`, // must include quotes as string
              },
            ],
          },
          page: { from: 0, limit: 100 },
        };

        const response = await fetch("/camunda/v2/user-tasks/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`API failed: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Tasks fetched:", data);

        const formatted = data.items.map((task) => ({
          id: task.userTaskKey,
          requestor: task.processName || "IT Request Workflow",
          unit: "<default>",
          service: task.name,
          priority: task.priority >= 80 ? "High" : "Standard",
          submitted: new Date(task.creationDate).toLocaleString(),
          status: task.state === "CREATED" ? "Pending" : task.state,
          details: task,
        }));

        setTasks(formatted);
      } catch (error) {
        console.error("❌ Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // ✅ Apply filters
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

  // Badge helper
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

  const handleReview = (details) => {
    navigate("/commander/approval-detail", { state: { request: details } });
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
                      onClick={() => handleReview(task.details)}
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

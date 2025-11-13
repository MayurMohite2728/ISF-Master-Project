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
  const { user } = useUser();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;
  const params = new URLSearchParams(location.search);
  const statusFilter = params.get("status") || "all";

  const currentUser = user?.username || "Unknown";

  // -----------------------------------------
  // 🚀 DUMMY API3 — User Task Search
  // -----------------------------------------
  const dummyAPI3 = async () => {
    return {
      items: [
        {
          name: "Manager Approval",
          state: "CREATED",
          creationDate: "2025-11-12T13:47:38.235Z",
          userTaskKey: "2251799813763668",
          processInstanceKey: "2251799813763634",
          processName: "IT Request Workflow",
          // This task belongs to Jasmine
          assignee: "Jasmine",
        },
        {
          name: "Manager Approval",
          state: "CREATED",
          creationDate: "2025-11-12T13:45:37.999Z",
          userTaskKey: "2251799813763341",
          processInstanceKey: "2251799813763248",
          processName: "IT Request Workflow",
          assignee: "Inthihas",
        },
      ],
    };
  };

  // -----------------------------------------
  // 🚀 DUMMY API2 — Variables by ProcessInstanceKey
  // -----------------------------------------
  const dummyAPI2 = async (processInstanceKey) => {
    const responses = {
      2251799813763634: {
        items: [
          { name: "requestedBy", value: '"Nandini"' },
          { name: "requestType", value: '"network"' },
          { name: "request", value: '"New IP phone installation"' },
          {
            name: "description",
            value: '"Need IP phone setup for a new employee(Sample)"',
          },
          { name: "status", value: '"Submitted"' },
          { name: "managerApproved", value: "true" },
        ],
      },
      2251799813763248: {
        items: [
          { name: "requestedBy", value: '"Jasmine"' },
          { name: "requestType", value: '"hardware"' },
          { name: "request", value: '"Laptop Request"' },
          {
            name: "description",
            value: '"Need IP phone setup for a new employee(Sample)"',
          },
          { name: "status", value: '"Pending"' },
          { name: "managerApproved", value: "false" },
        ],
      },
    };

    return responses[processInstanceKey];
  };

  // -----------------------------------------
  // 🟢 FETCH FLOW:
  // API3 → filter by assignee → API2 per record → Build table rows
  // -----------------------------------------

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);

      // 1️⃣ Get tasks from API3
      const api3 = await dummyAPI3();

      // 2️⃣ Filter only CURRENT USER tasks
      const userTasks = api3.items.filter(
        (task) => task.assignee === currentUser
      );

      // 3️⃣ For each record → Call API2
      const finalRows = await Promise.all(
        userTasks.map(async (task) => {
          const api2 = await dummyAPI2(task.processInstanceKey);

          // convert items → object
          const details = api2.items.reduce((acc, item) => {
            acc[item.name] = item.value?.replaceAll('"', "");
            return acc;
          }, {});

          return {
            id: task.processInstanceKey,
            requestedBy: details.requestedBy,
            userTaskKey: task.userTaskKey,
            service: details.request,
            description: details.description,
            priority: details.requestType === "network" ? "High" : "Standard",
            submitted: new Date(task.creationDate).toLocaleString(),
            status: task.state === "CREATED" ? "Pending" : task.state,
            details,
          };
        })
      );

      setTasks(finalRows);

      // 4️⃣ Send count to parent dashboard
      onCountUpdate?.({
        pending: finalRows.filter((t) => t.status === "Pending").length,
        approved: finalRows.filter((t) => t.status === "Approved").length,
        rejected: finalRows.filter((t) => t.status === "Rejected").length,
        total: finalRows.length,
      });

      setLoading(false);
    };

    loadTasks();
  }, [currentUser]);

  // -----------------------------------------
  // 🎨 WHITE BADGE STYLING
  // -----------------------------------------
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <Badge className="bg-white text-yellow-600 border border-yellow-600 px-3 py-1 rounded-full font-semibold">
            Pending
          </Badge>
        );
      case "Approved":
        return (
          <Badge className="bg-white text-green-600 border border-green-600 px-3 py-1 rounded-full font-semibold">
            Approved
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-white text-red-600 border border-red-600 px-3 py-1 rounded-full font-semibold">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-white text-gray-600 border border-gray-600 px-3 py-1 rounded-full font-semibold">
            {status}
          </Badge>
        );
    }
  };

  // -----------------------------------------
  // 🔍 FILTERING + PAGINATION
  // -----------------------------------------

  const filtered = useMemo(() => {
    let data = [...tasks];

    // Apply status filter
    if (statusFilter !== "all") {
      const s = statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
      data = data.filter((t) => t.status === s);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter((t) =>
        [t.id, t.service, t.priority, t.status]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    return data;
  }, [tasks, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  // -----------------------------------------
  // UI RENDER
  // -----------------------------------------

  const handleReview = (task) => {
    navigate("/commander/approval-detail", { state: { request: task } });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <h2 className="font-montserrat font-bold text-2xl text-charcoal">
          Approvals Inbox
        </h2>
      </div>

      <Card className="p-6">
        {/* Search */}
        <div className="mb-4 flex justify-end">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* TABLE */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Requested By</TableHead>
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
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No tasks found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.requestedBy}</TableCell>
                  <TableCell>{task.service}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.submitted}</TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => handleReview(task)}>
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
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
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

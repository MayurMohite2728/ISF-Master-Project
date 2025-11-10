import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { FileText, Clock, CheckCircle, AlertCircle, Search } from "lucide-react";

export default function SupervisorDashboard() {
  const navigate = useNavigate();
  const { t } = useI18n();

  // ---- DASHBOARD CARD SECTION ----
  const [activeCard, setActiveCard] = useState<
    "pending" | "total" | "approved" | "rejected"
  >("pending");

  const cardData = {
    pending: {
      label: t("commander.dashboard.pendingApprovals"),
      count: 7,
      border: "border-warning",
      icon: <Clock className="w-8 h-8 text-warning" />,
    },
    total: {
      label: t("commander.dashboard.totalRequests"),
      count: 15,
      border: "border-primary",
      icon: <FileText className="w-8 h-8 text-primary" />,
    },
    approved: {
      label: t("commander.dashboard.approvedToday"),
      count: 4,
      border: "border-success",
      icon: <CheckCircle className="w-8 h-8 text-success" />,
    },
    rejected: {
      label: t("commander.dashboard.rejected"),
      count: 4,
      border: "border-destructive",
      icon: <AlertCircle className="w-8 h-8 text-destructive" />,
    },
  };

  const [statusFilter, setStatusFilter] = useState("pending");

  const handleCardClick = (
    status: "pending" | "total" | "approved" | "rejected"
  ) => {
    setActiveCard(status);
    setStatusFilter(status === "total" ? "all" : status);
  };

  // ---- APPROVAL INBOX DATA ----
  const pendingApprovals = [
  { id: "REQ-2025-001247", requestor: "User Name1", unit: "Field Ops", service: "Desktop Phone", priority: "Standard", submitted: "Today, 14:58", status: "Pending" },
  { id: "REQ-2025-001248", requestor: "User Name2", unit: "Intelligence", service: "Laptop", priority: "High", submitted: "Today, 13:22", status: "Approved" },
  { id: "REQ-2025-001249", requestor: "User Name3", unit: "Cyber Ops", service: "Network Access", priority: "High", submitted: "Today, 12:15", status: "Rejected" },
  { id: "REQ-2025-001250", requestor: "User Name4", unit: "Field Ops", service: "Monitor", priority: "Standard", submitted: "Today, 11:40", status: "Pending" },
  { id: "REQ-2025-001251", requestor: "User Name5", unit: "Command Center", service: "Desktop Phone", priority: "High", submitted: "Today, 10:05", status: "Approved" },
  { id: "REQ-2025-001252", requestor: "User Name6", unit: "Security Division", service: "Laptop", priority: "Standard", submitted: "Today, 09:30", status: "Pending" },
  { id: "REQ-2025-001253", requestor: "User Name7", unit: "Field Ops", service: "Network Access", priority: "High", submitted: "Today, 08:45", status: "Rejected" },
  { id: "REQ-2025-001254", requestor: "User Name8", unit: "Intelligence", service: "Desktop Phone", priority: "Standard", submitted: "Yesterday, 17:20", status: "Pending" },
  { id: "REQ-2025-001255", requestor: "User Name9", unit: "Command Center", service: "Monitor", priority: "High", submitted: "Yesterday, 16:10", status: "Approved" },
  { id: "REQ-2025-001256", requestor: "User Name10", unit: "Cyber Ops", service: "Laptop", priority: "Standard", submitted: "Yesterday, 15:00", status: "Pending" },
  { id: "REQ-2025-001257", requestor: "User Name11", unit: "Field Ops", service: "Desktop Phone", priority: "High", submitted: "Yesterday, 14:30", status: "Rejected" },
  { id: "REQ-2025-001258", requestor: "User Name12", unit: "Security Division", service: "Network Access", priority: "Standard", submitted: "Yesterday, 13:15", status: "Pending" },
  { id: "REQ-2025-001259", requestor: "User Name13", unit: "Intelligence", service: "Monitor", priority: "High", submitted: "Yesterday, 12:00", status: "Approved" },
  { id: "REQ-2025-001260", requestor: "User Name14", unit: "Command Center", service: "Laptop", priority: "Standard", submitted: "Yesterday, 11:20", status: "Pending" },
  { id: "REQ-2025-001261", requestor: "User Name15", unit: "Cyber Ops", service: "Desktop Phone", priority: "High", submitted: "Yesterday, 10:45", status: "Rejected" },
];

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredApprovals = useMemo(() => {
    let approvals = pendingApprovals;
    if (statusFilter !== "all") {
      const statusCap =
        statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
      approvals = approvals.filter((a) => a.status === statusCap);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      approvals = approvals.filter((a) =>
        Object.values(a).join(" ").toLowerCase().includes(query)
      );
    }
    return approvals;
  }, [statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredApprovals.length / itemsPerPage);
  const paginatedApprovals = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredApprovals.slice(start, start + itemsPerPage);
  }, [filteredApprovals, currentPage]);

  useEffect(() => setCurrentPage(1), [searchQuery, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-yellow-300 text-yellow-900">{status}</Badge>;
      case "Approved":
        return <Badge className="bg-green-300 text-green-900">{status}</Badge>;
      case "Rejected":
        return <Badge className="bg-red-300 text-red-900">{status}</Badge>;
      default:
        return <Badge className="bg-gray-300 text-gray-900">{status}</Badge>;
    }
  };

  // ---- UI ----
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="font-montserrat font-bold text-3xl text-primary mb-2">
          {t("supervisor.dashboard.title")}
        </h2>
        <p className="text-muted-foreground font-open-sans">
          {t("supervisor.dashboard.subtitle")}
        </p>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {(["pending", "total", "approved", "rejected"] as const).map((key) => {
          const card = cardData[key];
          const isActive = key === activeCard;
          return (
            <Card
              key={key}
              onClick={() => handleCardClick(key)}
              className={`p-6 border-l-4 cursor-pointer transition
                ${card.border}
                ${isActive ? "shadow-lg" : "hover:shadow-md"}
              `}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-open-sans">{card.label}</p>
                  <p className="text-3xl font-montserrat font-bold">
                    {card.count}
                  </p>
                </div>
                {card.icon}
              </div>
            </Card>
          );
        })}
      </div>

      {/* ---- APPROVAL INBOX TABLE SECTION ---- */}
      <Card className="p-6">
               {/* Search */}
        <div className="mb-4 flex justify-between">
           <h3 className="font-montserrat font-semibold text-xl mb-4">
          {t("approvalsInbox.title")}
        </h3>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("approvalsInbox.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("approvalsInbox.requestId")}</TableHead>
              <TableHead>{t("approvalsInbox.requestor")}</TableHead>
              <TableHead>{t("approvalsInbox.unit")}</TableHead>
              <TableHead>{t("approvalsInbox.service")}</TableHead>
              <TableHead>{t("approvalsInbox.priority")}</TableHead>
              <TableHead>{t("approvalsInbox.submitted")}</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>{t("approvalsInbox.action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApprovals.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-charcol"
                >
                  {searchQuery
                    ? t("approvalsInbox.noResults")
                    : t("approvalsInbox.noApprovals")}
                </TableCell>
              </TableRow>
            ) : (
              paginatedApprovals.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="text-primary font-semibold">
                    {a.id}
                  </TableCell>
                  <TableCell>{a.requestor}</TableCell>
                  <TableCell>{a.unit}</TableCell>
                  <TableCell>{a.service}</TableCell>
                  <TableCell>
                    <Badge
                      variant={a.priority === "High" ? "destructive" : "secondary"}
                    >
                      {a.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{a.submitted}</TableCell>
                  <TableCell>{getStatusBadge(a.status)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => navigate("/commander/approval-detail")}
                    >
                      {t("common.review")}
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
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
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
                        isActive={currentPage === page}
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
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
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

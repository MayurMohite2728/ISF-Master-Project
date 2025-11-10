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

export default function ApprovalsInbox() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // rows per page

  // Get status from URL query param
  const params = new URLSearchParams(location.search);
  const statusFilter = params.get("status") || "all"; // "pending", "approved", "rejected", "all"

  // Filtered approvals by status and search query
  const filteredApprovals = useMemo(() => {

    const stored = JSON.parse(localStorage.getItem("requests")) || [];
    
     const localApprovals = stored.map((req) => ({
    id: req.id || `REQ-${Date.now()}`,
    requestor: req.requestor_name || "Unknown",
    unit: req.unit || "N/A",
    service: req.phone_model || req.serviceType || "Hardware Request",
    priority: req.priority || "Standard",
    submitted: new Date(req.submitted_date || Date.now()).toLocaleString("en-US"),
    status:
       req.current_status?.charAt(0).toUpperCase() +
        req.current_status?.slice(1).toLowerCase() || "Pending",
  }));

  
    let approvals = [...localApprovals,...pendingApprovals];



    // Filter by status
    if (statusFilter !== "all") {
      const statusCapitalized = statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
      approvals = approvals.filter((approval) => approval.status === statusCapitalized);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      approvals = approvals.filter((approval) => {
        const searchableText = [
          approval.id,
          approval.requestor,
          approval.unit,
          approval.service,
          approval.priority,
          approval.submitted,
          approval.status,
        ].filter(Boolean).join(" ").toLowerCase();
        return searchableText.includes(query);
      });
    }

    return approvals;
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredApprovals.length / itemsPerPage);
  const paginatedApprovals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredApprovals.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredApprovals, currentPage]);

  useEffect(() => setCurrentPage(1), [searchQuery, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-yellow-300 text-yellow-900 font-open-sans">{status}</Badge>;
      case "Approved":
        return <Badge className="bg-green-300 text-green-900 font-open-sans">{status}</Badge>;
      case "Rejected":
        return <Badge className="bg-red-300 text-red-900 font-open-sans">{status}</Badge>;
      default:
        return <Badge className="bg-gray-300 text-gray-900 font-open-sans">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* <Button variant="ghost" onClick={() => navigate("/commander/dashboard")} className="mb-4">
        {t("approvalsInbox.backToDashboard")}
      </Button> */}

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
              <TableHead className="font-montserrat font-semibold">{t("approvalsInbox.requestId")}</TableHead>
              <TableHead className="font-montserrat font-semibold">{t("approvalsInbox.requestor")}</TableHead>
              <TableHead className="font-montserrat font-semibold">{t("approvalsInbox.unit")}</TableHead>
              <TableHead className="font-montserrat font-semibold">{t("approvalsInbox.service")}</TableHead>
              <TableHead className="font-montserrat font-semibold">{t("approvalsInbox.priority")}</TableHead>
              <TableHead className="font-montserrat font-semibold">{t("approvalsInbox.submitted")}</TableHead>
              <TableHead className="font-montserrat font-semibold">Status</TableHead>
              <TableHead className="font-montserrat font-semibold">{t("approvalsInbox.action")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedApprovals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground font-open-sans">
                  {searchQuery ? t("approvalsInbox.noResults") : t("approvalsInbox.noApprovals")}
                </TableCell>
              </TableRow>
            ) : (
              paginatedApprovals.map((approval) => (
                <TableRow key={approval.id} className="hover:bg-muted/50">
                  <TableCell className="font-montserrat font-semibold text-primary">{approval.id}</TableCell>
                  <TableCell className="font-open-sans">{approval.requestor}</TableCell>
                  <TableCell className="font-open-sans">{approval.unit}</TableCell>
                  <TableCell className="font-open-sans">{approval.service}</TableCell>
                  <TableCell>
                    <Badge
                      variant={approval.priority === "High" ? "destructive" : "secondary"}
                      className="font-open-sans"
                    >
                      {approval.priority === "High" ? t("common.high") : t("common.standard")}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-open-sans text-sm text-muted-foreground">{approval.submitted}</TableCell>
                  <TableCell>{getStatusBadge(approval.status)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => navigate("/commander/approval-detail")}
                      className="font-montserrat"
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
                      setCurrentPage((prev) => Math.max(1, prev - 1));
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Showing X of Y */}
        {filteredApprovals.length > 0 && (
          <div className="mt-2 text-sm text-muted-foreground font-open-sans text-right">
            {t("approvalsInbox.showing")} {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredApprovals.length)} {t("approvalsInbox.of")} {filteredApprovals.length}
          </div>
        )}
      </Card>
    </div>
  );
}

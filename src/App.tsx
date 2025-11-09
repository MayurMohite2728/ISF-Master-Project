import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/contexts/I18nContext";
import { UserProvider } from "@/contexts/UserContext";
import { RouteLayout } from "@/components/RouteLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import OfficerDashboard from "./pages/OfficerDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TechApproverDashboard from "./pages/TechApproverDashboard";
import ServiceCatalog from "./pages/ServiceCatalog";
import PhoneRequestForm from "./pages/PhoneRequestForm";
import RequestSubmitted from "./pages/RequestSubmitted";
import RequestStatus from "./pages/RequestStatus";
import CommanderDashboard from "./pages/CommanderDashboard";
import ApprovalsInbox from "./pages/ApprovalsInbox";
import ApprovalDetail from "./pages/ApprovalDetail";
import StatusApproved from "./pages/StatusApproved";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <I18nProvider>
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RouteLayout>
              <Routes>
                <Route path="/" element={<Login />} />
                
                {/* Officer/Requester Routes */}
                <Route 
                  path="/officer/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={["officer"]}>
                      <OfficerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/service-catalog" 
                  element={
                    <ProtectedRoute allowedRoles={["officer", "supervisor"]}>
                      <ServiceCatalog />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/request/phone" 
                  element={
                    <ProtectedRoute allowedRoles={["officer", "supervisor"]}>
                      <PhoneRequestForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/request/submitted" 
                  element={
                    <ProtectedRoute allowedRoles={["officer", "supervisor"]}>
                      <RequestSubmitted />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/request/status" 
                  element={
                    <ProtectedRoute allowedRoles={["officer", "supervisor"]}>
                      <RequestStatus />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/request/status-approved" 
                  element={
                    <ProtectedRoute allowedRoles={["officer", "supervisor"]}>
                      <StatusApproved />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Supervisor Routes */}
                <Route 
                  path="/supervisor/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={["supervisor"]}>
                      <SupervisorDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/supervisor/approvals" 
                  element={
                    <ProtectedRoute allowedRoles={["supervisor"]}>
                      <ApprovalsInbox />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/requests" 
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <RequestStatus />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/assign" 
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <ApprovalsInbox />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/sla-monitor" 
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <RequestStatus />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Technical Approver Routes */}
                <Route 
                  path="/tech-approver/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={["tech_approver"]}>
                      <TechApproverDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/tech-approver/reviews" 
                  element={
                    <ProtectedRoute allowedRoles={["tech_approver"]}>
                      <ApprovalsInbox />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/tech-approver/review/:id" 
                  element={
                    <ProtectedRoute allowedRoles={["tech_approver"]}>
                      <ApprovalDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/tech-approver/network" 
                  element={
                    <ProtectedRoute allowedRoles={["tech_approver"]}>
                      <RequestStatus />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/tech-approver/server" 
                  element={
                    <ProtectedRoute allowedRoles={["tech_approver"]}>
                      <RequestStatus />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/tech-approver/storage" 
                  element={
                    <ProtectedRoute allowedRoles={["tech_approver"]}>
                      <RequestStatus />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/tech-approver/security" 
                  element={
                    <ProtectedRoute allowedRoles={["tech_approver"]}>
                      <RequestStatus />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Legacy Commander Routes (kept for backwards compatibility) */}
                <Route path="/commander/dashboard" element={<CommanderDashboard />} />
                <Route path="/commander/approvals" element={<ApprovalsInbox />} />
                <Route path="/commander/approval-detail" element={<ApprovalDetail />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </RouteLayout>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </UserProvider>
  </I18nProvider>
);

export default App;

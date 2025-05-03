
import { Routes, Route } from "react-router-dom";
import FeaturesPage from "@/pages/FeaturesPage";
import PlanBuilderPage from "@/pages/PlanBuilderPage";
import DashboardPage from "@/pages/DashboardPage";
import MedicaidBillingPage from "@/pages/MedicaidBillingPage";
import ClearinghouseExportPage from "@/pages/ClearinghouseExportPage";
import CentralReachImportPage from "@/pages/CentralReachImportPage";
import SupervisionToolsPage from "@/pages/SupervisionToolsPage";
import Welcome from "@/pages/Welcome";
import Home from "@/pages/Home";
import BetaFeedback from "@/pages/BetaFeedback";
import Empower from "@/pages/Empower";
import Elite from "@/pages/Elite";
import NotFound from "@/pages/NotFound";
import JoinBeta from "@/pages/JoinBeta";
import BetaSignup from "@/pages/BetaSignup";
import Unauthorized from "@/pages/Unauthorized";
import { ClientRoute, clientRoutes } from "@/routes/ClientRoutes";
import ClientDashboard from "@/pages/client/ClientDashboard";
import ClientPlan from "@/pages/client/ClientPlan";
import ClientProfile from "@/pages/client/ClientProfile";
import { RBTRoute, rbtRoutes } from "@/routes/RBTRoutes";
import RbtDashboard from "@/pages/rbt/RbtDashboard";
import RbtNotes from "@/pages/rbt/RbtNotes";
import RbtFlagged from "@/pages/rbt/RbtFlagged";
import RbtClientProfile from "@/pages/rbt/ClientProfile";
import SessionLogs from "@/pages/rbt/SessionLogs";
import SessionNew from "@/pages/rbt/SessionNew";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Login from "@/pages/Login";
import BCBAFlagged from "@/pages/bcba/BCBAFlagged";
import { bcbaRoutes, BCBARoute } from "@/routes/BCBARoutes";
import ClientDetails from "@/pages/bcba/ClientDetails";
import BCBAClientProfile from "@/pages/bcba/ClientProfile";
import Profile from "@/pages/Profile";
import Goals from "@/pages/Goals";
import DailyFlow from "@/pages/DailyFlow";
import Messages from "@/pages/Messages";
import Settings from "@/pages/Settings";
import Newsletter from "@/pages/Newsletter";
import Trends from "@/pages/Trends";
import Dashboard from "@/pages/early-access/Dashboard";
import FoundingMembers from "@/pages/FoundingMembers";
import HelpCenter from "@/pages/HelpCenter";
import { AdminRoute } from "@/routes/AdminRoute";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import BillingCodes from "@/pages/admin/BillingCodes";
import PayerRules from "@/pages/admin/PayerRules";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/plan-builder" element={<PlanBuilderPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/medicaid-billing" element={<MedicaidBillingPage />} />
      <Route path="/clearinghouse-export" element={<ClearinghouseExportPage />} />
      <Route path="/centralreach-import" element={<CentralReachImportPage />} />
      <Route path="/supervision-tools" element={<SupervisionToolsPage />} />
      <Route path="/beta-feedback" element={<BetaFeedback />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/empower" element={<Empower />} />
      <Route path="/elite" element={<Elite />} />
      <Route path="/join-beta" element={<BetaSignup />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/daily-flow" element={<DailyFlow />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/newsletter" element={<Newsletter />} />
      <Route path="/trends" element={<Trends />} />
      <Route path="/early-access/dashboard" element={<Dashboard />} />
      <Route path="/founding-members" element={<FoundingMembers />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/help/:slug" element={<HelpCenter />} />
      
      {/* Client Routes with protection */}
      <Route 
        path="/client/dashboard" 
        element={
          <ClientRoute>
            <ClientDashboard />
          </ClientRoute>
        } 
      />
      <Route 
        path="/client/plan" 
        element={
          <ClientRoute>
            <ClientPlan />
          </ClientRoute>
        } 
      />
      <Route 
        path="/client/profile" 
        element={
          <ClientRoute>
            <ClientProfile />
          </ClientRoute>
        } 
      />
      
      {/* RBT Routes with protection */}
      <Route 
        path="/rbt" 
        element={
          <ProtectedRoute allowedRoles={['RBT']}>
            <RbtDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/rbt/client/:clientId" 
        element={
          <ProtectedRoute allowedRoles={['RBT']}>
            <RbtClientProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/rbt/sessions" 
        element={
          <ProtectedRoute allowedRoles={['RBT']}>
            <SessionLogs />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/rbt/sessions/new" 
        element={
          <ProtectedRoute allowedRoles={['RBT']}>
            <SessionNew />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/rbt/notes" 
        element={
          <ProtectedRoute allowedRoles={['RBT']}>
            <RbtNotes />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/rbt/flagged" 
        element={
          <ProtectedRoute allowedRoles={['RBT']}>
            <RbtFlagged />
          </ProtectedRoute>
        } 
      />

      {/* BCBA Routes */}
      <Route path="/bcba/flagged" element={<BCBAFlagged />} />
      
      {/* BCBA Client routes */}
      <Route path="/bcba/client/:clientId" element={<ClientDetails />} />
      <Route path="/bcba/client/:clientId/profile" element={<BCBAClientProfile />} />
      
      {/* Admin Routes with protection */}
      <Route 
        path="/admin/dashboard" 
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route 
        path="/admin/billing-codes" 
        element={
          <AdminRoute>
            <BillingCodes />
          </AdminRoute>
        }
      />
      <Route 
        path="/admin/payer-rules" 
        element={
          <AdminRoute>
            <PayerRules />
          </AdminRoute>
        }
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

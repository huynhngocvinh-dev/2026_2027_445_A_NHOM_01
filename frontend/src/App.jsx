import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// ================= USER =================
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OtpPage from "./pages/OtpPage";

import JobListPage from "./pages/Jobs/JobListPage";
import EditJobPage from "./pages/Jobs/EditJobPage";
import SavedJobsPage from "./pages/Jobs/SavedJobsPage";
import ProfilePage from "./pages/User/ProfilePage";

// ================= HR =================
import HrLayout from "./pages/hr/HrLayout";
import HrCreateJobPage from "./pages/hr/CreateJobPage";
import CompanyInfoPage from "./pages/hr/CompanyInfoPage";
import HrJobsPage from "./pages/hr/HrJobsPage";
import CandidatesPage from "./pages/hr/CandidatesPage";

// ================= ADMIN =================
import DashboardPage from "./pages/Admin/DashboardPage";
import UserManagementPage from "./pages/Admin/UserManagementPage";
import JobApprovalPage from "./pages/Admin/JobApprovalPage";
import CrawlManagementPage from "./pages/Admin/CrawlManagementPage";
import SourceManagementPage from "./pages/Admin/SourceManagementPage";
import DuplicatesPage from "./pages/Admin/DuplicatesPage";
import ApplicationManagementPage from "./pages/Admin/ApplicationManagementPage";
import StatisticsPage from "./pages/Admin/StatisticsPage";
import JobApprovalAiPage from "./pages/Admin/JobApprovalAiPage";

function App() {
  return (
    <Routes>
      {/* ============ PUBLIC (Ai cũng có thể truy cập) ============ */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobListPage />} />
      </Route>

      {/* ============ AUTH PAGES (Trang xác thực) ============ */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OtpPage />} />

      {/* ============ ACCOUNT (Bắt buộc phải ĐĂNG NHẬP) ============ */}
      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/account/profile" element={<ProfilePage />} />
          <Route path="/account/saved-jobs" element={<SavedJobsPage />} />
          <Route path="/jobs/:id/edit" element={<EditJobPage />} />
        </Route>
      </Route>

      {/* ============ HR / EMPLOYER (Chỉ dành cho Nhà tuyển dụng & Admin) ============ */}
      <Route
        element={<ProtectedRoute allowedRoles={["EMPLOYER", "HR", "ADMIN"]} />}
      >
        <Route element={<HrLayout />}>
          <Route path="/hr/company" element={<CompanyInfoPage />} />
          <Route path="/hr/create" element={<HrCreateJobPage />} />
          <Route path="/hr/jobs" element={<HrJobsPage />} />
          <Route path="/hr/candidates" element={<CandidatesPage />} />
        </Route>
      </Route>

      {/* ============ ADMIN (Chỉ dành riêng cho ADMIN) ============ */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/jobs" element={<JobApprovalPage />} />
          <Route path="/admin/sources" element={<SourceManagementPage />} />
          <Route path="/admin/duplicates" element={<DuplicatesPage />} />
          <Route path="/admin/crawl" element={<CrawlManagementPage />} />
          <Route path="/admin/ai-approval" element={<JobApprovalAiPage />} />
          <Route
            path="/admin/applications"
            element={<ApplicationManagementPage />}
          />
          <Route path="/admin/statistics" element={<StatisticsPage />} />
        </Route>
      </Route>

      {/* ============ 404 CATCH ALL ============ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

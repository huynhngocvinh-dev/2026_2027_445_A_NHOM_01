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
import ApplicationHistoryPage from "./pages/Jobs/applyPage";

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

import { ROLES } from "./constants/roles";

/**
 * Cây route của toàn app. Chia làm 3 nhóm:
 * 1. Public (MainLayout)   - ai cũng xem được: trang chủ, tìm việc
 * 2. Account (UserLayout)  - phải đăng nhập: hồ sơ, việc đã lưu, đăng tin (EMPLOYER/ADMIN)
 * 3. Admin (AdminLayout)   - chỉ role ADMIN
 * Login/Register/Otp không dùng layout nào (trang toàn màn hình riêng).
 */
function App() {
  return (
    <Routes>
      {/* ============ PUBLIC (candidate-facing) ============ */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobListPage />} />
      </Route>

      {/* ============ AUTH PAGES (không layout) ============ */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OtpPage />} />

      {/* ============ ACCOUNT (yêu cầu đăng nhập) ============ */}
      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/account/profile" element={<ProfilePage />} />
          <Route path="/account/saved-jobs" element={<SavedJobsPage />} />

          {/* Đăng/sửa tin chỉ dành cho nhà tuyển dụng hoặc admin */}
          <Route
            element={
              <ProtectedRoute allowedRoles={[ROLES.EMPLOYER, ROLES.ADMIN]} />
            }
          >
            <Route path="/jobs/:id/edit" element={<EditJobPage />} />
          </Route>
        </Route>
      </Route>

      {/* ============ ADMIN (chỉ role ADMIN) ============ */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/jobs" element={<JobApprovalPage />} />
          <Route path="/admin/crawl" element={<CrawlManagementPage />} />
          <Route path="/admin/sources" element={<SourceManagementPage />} />
          <Route path="/admin/duplicates" element={<DuplicatesPage />} />
   
          <Route
            path="/admin/applications"
            element={<ApplicationManagementPage />}
          />               <Route
          path="/applications"
          element={<ApplicationHistoryPage />}
        />
          <Route path="/admin/statistics" element={<StatisticsPage />} />
        </Route>
      </Route>

      {/* ============ HR (chỉ role HR) ============ */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.HR]} />}>
        <Route element={<HrLayout />}>
          {/* 1. Thông tin công ty */}
          <Route path="/hr/company" element={<CompanyInfoPage />} />

          {/* 2. Đăng tin tuyển dụng */}
          <Route path="/hr/jobs/create" element={<HrCreateJobPage />} />

          {/* 3. Tin tuyển dụng */}
          <Route path="/hr/jobs" element={<HrJobsPage />} />

          {/* 4. Ứng viên */}
          <Route path="/hr/candidates" element={<CandidatesPage />} />
        </Route>
      </Route>

      {/* ============ 404 ============ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

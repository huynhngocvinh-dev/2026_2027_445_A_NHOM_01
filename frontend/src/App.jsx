import { Routes, Route, Navigate } from "react-router-dom";

// ================= USER =================
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OtpPage from "./pages/OtpPage";

// ================= ADMIN =================
import AdminLayout from "./layouts/AdminLayout";

import DashboardPage from "./pages/Admin/DashboardPage";
import UserManagementPage from "./pages/Admin/UserManagementPage";
import CrawlManagementPage from "./pages/Admin/CrawlManagementPage";
import JobApprovalPage from "./pages/Admin/JobApprovalPage";
import SourceManagementPage from "./pages/Admin/SourceManagementPage";
import ApplicationManagementPage from "./pages/Admin/ApplicationManagementPage";
import StatisticsPage from "./pages/Admin/StatisticsPage";
import DuplicatesPage from "./pages/Admin/DuplicatesPage";

function App() {
  return (
    <Routes>
      {/* =========================
          USER
      ========================= */}

      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OtpPage />} />

      {/* =========================
          ADMIN
      ========================= */}

      <Route path="/admin" element={<AdminLayout />}>
        {/* Dashboard */}
        <Route index element={<DashboardPage />} />

        {/* Quản lý người dùng */}
        <Route path="users" element={<UserManagementPage />} />

        {/* Tin tuyển dụng */}
        <Route path="jobs" element={<JobApprovalPage />} />

        {/* Dữ liệu thu thập */}
        <Route path="crawl" element={<CrawlManagementPage />} />

        {/* Nguồn tuyển dụng */}
        <Route path="sources" element={<SourceManagementPage />} />

        {/* Tin trùng lặp */}
        <Route path="duplicates" element={<DuplicatesPage />} />

        {/* Ứng tuyển */}
        <Route path="applications" element={<ApplicationManagementPage />} />

        {/* Thống kê */}
        <Route path="statistics" element={<StatisticsPage />} />
      </Route>

      {/* =========================
          KHÔNG TÌM THẤY TRANG
      ========================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

/**
 * Khung cho toàn bộ trang công khai phía ứng viên: trang chủ, tìm việc, chi tiết việc...
 * Không yêu cầu đăng nhập - Header tự đổi giao diện tùy trạng thái auth.
 */
function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ADMIN_NAV = [
  { label: "Tổng quan", to: "/admin", icon: "📊" },
  { label: "Quản lý việc làm", to: "/admin/jobs", icon: "💼" },
  { label: "Quản lý người dùng", to: "/admin/users", icon: "👥" },
  { label: "Quản lý dữ liệu crawl", to: "/admin/crawl", icon: "🕸️" },
];

/**
 * Khung riêng cho khu vực quản trị - sidebar tối màu, không dùng chung Header
 * với phía ứng viên vì khác hẳn ngữ cảnh sử dụng. Đặt sau <ProtectedRoute
 * allowedRoles={["ADMIN"]} /> trong router nên không tự kiểm tra quyền ở đây.
 */
function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      <aside className="flex w-[230px] shrink-0 flex-col bg-[#0b1b3a] px-4 py-5 text-[#c9d3e6]">
        <p className="mb-6 px-2 text-[17px] font-bold text-white">
          JobFinder Admin
        </p>

        <nav className="flex flex-1 flex-col gap-1">
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-[7px] px-3 py-2 text-[12px] no-underline transition ${
                  isActive
                    ? "bg-[#16264d] font-semibold text-white"
                    : "text-[#a9b8dc] hover:bg-[#16264d]"
                }`
              }
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 border-t border-[#1f2f52] pt-4">
          <p className="truncate px-2 text-[11px] text-[#8fa0c4]">
            {user?.email}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 w-full cursor-pointer rounded-[7px] border-none bg-transparent px-3 py-2 text-left text-[12px] text-[#e0a1a1] hover:bg-[#16264d]"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;

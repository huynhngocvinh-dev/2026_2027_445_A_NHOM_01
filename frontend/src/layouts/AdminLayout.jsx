import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBriefcase,
  FiDatabase,
  FiGlobe,
  FiCopy,
  FiFileText,
  FiBarChart2,
  FiBell,
  FiLogOut,
  FiCpu, // Icon dùng cho mục Duyệt tin AI
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";

// ========================================ADMIN=========================================
const MENU_ITEMS = [
  { name: "Dashboard", path: "/admin", icon: FiHome },
  { name: "Quản lý người dùng", path: "/admin/users", icon: FiUsers },
  { name: "Tin tuyển dụng", path: "/admin/jobs", icon: FiBriefcase },
  { name: "Quản lý Crawler", path: "/admin/crawl", icon: FiDatabase },
  { name: "Duyệt tin AI", path: "/admin/ai-approval", icon: FiCpu }, // Bổ sung đường dẫn Duyệt tin AI
  { name: "Nguồn tuyển dụng", path: "/admin/sources", icon: FiGlobe },
  { name: "Tin trùng lặp", path: "/admin/duplicates", icon: FiCopy },
  { name: "Ứng tuyển", path: "/admin/applications", icon: FiFileText },
  { name: "Thống kê", path: "/admin/statistics", icon: FiBarChart2 },
];

/**
 * Khung riêng cho khu vực quản trị.
 */
function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        {/* ================= SIDEBAR ================= */}
        <aside className="flex w-72 shrink-0 flex-col bg-slate-950 text-white">
          {/* LOGO */}
          <div className="border-b border-slate-800 px-6 py-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                <FiBriefcase size={18} />
              </div>
              <span className="text-xl font-bold">JobFinder</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">Quản trị viên</p>
          </div>

          {/* ================= MENU ================= */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {MENU_ITEMS.map((item) => {
              const active =
                item.path === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(item.path);
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex h-11 items-center gap-3 rounded-xl px-4 text-sm transition ${
                    active
                      ? "bg-blue-600 font-semibold text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* ================= ADMIN ACCOUNT ================= */}
          <div className="border-t border-slate-800 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold">
                {(user?.fullName || "AD").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {user?.fullName || "Admin System"}
                </p>
                <p className="truncate text-xs text-slate-400">{user?.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 flex w-full cursor-pointer items-center gap-2 rounded-xl border-none bg-transparent px-2 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <FiLogOut size={16} />
              Đăng xuất
            </button>
          </div>
        </aside>

        {/* ================= PHẦN TRANG ================= */}
        <main className="min-w-0 flex-1">
          {/* HEADER */}
          <header className="flex h-16 items-center justify-end border-b border-slate-200 bg-white px-8">
            <FiBell
              size={20}
              className="text-slate-500 cursor-pointer hover:text-slate-700"
            />
          </header>

          {/* TRANG CON HIỂN THỊ Ở ĐÂY */}
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

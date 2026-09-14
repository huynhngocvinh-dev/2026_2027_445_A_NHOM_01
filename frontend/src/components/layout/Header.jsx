import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiBriefcase, FiBell, FiUser, FiHeart, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../constants/roles";

// Điều hướng mặc định cho khách/ứng viên trên trang chính.
// Header vẫn nhận prop navItems riêng nếu 1 trang nào đó cần menu khác.
const DEFAULT_NAV_ITEMS = [
  { label: "Trang chủ", to: "/", end: true },
  { label: "Việc làm", to: "/jobs" },
  { label: "Việc làm đã lưu", to: "/account/saved-jobs", requireAuth: true },
];

/**
 * Header dùng chung cho toàn bộ trang candidate-facing (MainLayout, UserLayout).
 * Đây là component DUY NHẤT vẽ header - trước đây HomePage tự vẽ lại header
 * riêng (trùng lặp với header chung), nay HomePage cũng dùng lại component này.
 * Tự hiển thị nút "Đăng nhập/Đăng ký" khi là khách, hoặc avatar + menu khi đã đăng nhập.
 */
function Header({ navItems = DEFAULT_NAV_ITEMS }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const visibleNavItems = navItems.filter((item) => !item.requireAuth || isAuthenticated);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
        <div className="h-[72px] flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <FiBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">JobFinder</span>
          </Link>

          {/* MENU */}
          <nav className="hidden lg:flex items-center gap-1 ml-8 mr-auto">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition ${
                    isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="hidden sm:block text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition shadow-sm"
                >
                  Đăng ký
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  aria-label="Thông báo"
                  className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition"
                >
                  <FiBell size={18} />
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                  >
                    <FiUser size={16} />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-11 w-[200px] rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
                      <p className="truncate px-3 pb-2 text-xs font-semibold text-gray-900">
                        {user?.fullName || user?.email}
                      </p>
                      <Link
                        to="/account/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 no-underline hover:bg-gray-50"
                      >
                        <FiUser size={13} /> Hồ sơ của tôi
                      </Link>
                      <Link
                        to="/account/saved-jobs"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 no-underline hover:bg-gray-50"
                      >
                        <FiHeart size={13} /> Việc làm đã lưu
                      </Link>
                      {user?.role === ROLES.ADMIN && (
                        <Link
                          to="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 no-underline hover:bg-gray-50"
                        >
                          <FiBriefcase size={13} /> Trang quản trị
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                      >
                        <FiLogOut size={13} /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

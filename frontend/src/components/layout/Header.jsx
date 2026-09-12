import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hook/useAuth";
import Button from "../Button";
import IconButton from "../Iconbutton";

// Điều hướng mặc định cho khách/ứng viên trên trang chính.
// Header vẫn nhận prop navItems riêng nếu 1 trang nào đó cần menu khác.
const DEFAULT_NAV_ITEMS = [
  { label: "Tìm kiếm", to: "/jobs" },
  { label: "Việc làm đã lưu", to: "/account/saved-jobs", requireAuth: true },
];

/**
 * Header dùng chung cho toàn bộ trang candidate-facing (MainLayout, UserLayout).
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

  const visibleNavItems = navItems.filter(
    (item) => !item.requireAuth || isAuthenticated
  );

  return (
    <header className="flex h-[62px] items-center border-b border-[#e1e6ef] bg-white px-7">
      <Link
        to="/"
        className="mr-[35px] text-[19px] font-bold text-[#063b91] no-underline"
      >
        JobFinder
      </Link>

      <nav className="flex items-center gap-7">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-[#0645a5] pb-5 pt-[22px] text-[13px] font-semibold text-[#0645a5]"
                : "text-[13px] text-[#667085] transition hover:text-[#0645a5]"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-[14px]">
        {!isAuthenticated ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/register")}
            >
              Đăng ký
            </Button>
          </>
        ) : (
          <>
            <IconButton label="Thông báo">🔔</IconButton>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full border-none bg-[#f1f4f8] text-sm"
              >
                👤
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-[38px] w-[190px] rounded-[8px] border border-[#e1e6ef] bg-white py-2 shadow-[0_8px_20px_rgba(20,40,80,0.12)]">
                  <p className="truncate px-3 pb-2 text-[11px] font-semibold text-[#16233e]">
                    {user?.fullName || user?.email}
                  </p>
                  <Link
                    to="/account/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 text-[12px] text-[#344054] no-underline hover:bg-[#f4f7fc]"
                  >
                    Hồ sơ của tôi
                  </Link>
                  <Link
                    to="/account/saved-jobs"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 text-[12px] text-[#344054] no-underline hover:bg-[#f4f7fc]"
                  >
                    Việc làm đã lưu
                  </Link>
                  {user?.role === "ADMIN" && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2 text-[12px] text-[#344054] no-underline hover:bg-[#f4f7fc]"
                    >
                      Trang quản trị
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full cursor-pointer border-none bg-transparent px-3 py-2 text-left text-[12px] text-[#c0392b] hover:bg-[#fdf1f0]"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;

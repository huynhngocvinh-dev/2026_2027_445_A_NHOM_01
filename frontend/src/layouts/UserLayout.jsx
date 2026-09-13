import { NavLink, Outlet } from "react-router-dom";
import { FiUser, FiHeart, FiPlusCircle } from "react-icons/fi";
import Header from "../components/layout/Header";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";

const ACCOUNT_NAV = [
  { label: "Hồ sơ của tôi", to: "/account/profile", icon: FiUser },
  { label: "Việc làm đã lưu", to: "/account/saved-jobs", icon: FiHeart },
];

const EMPLOYER_NAV = [{ label: "Đăng tin tuyển dụng", to: "/jobs/create", icon: FiPlusCircle }];

/**
 * Khung cho khu vực tài khoản của người dùng đã đăng nhập (ứng viên/nhà tuyển dụng):
 * Header dùng chung + sidebar điều hướng riêng cho khu vực tài khoản + nội dung trang.
 * Đặt sau <ProtectedRoute /> trong router nên không cần tự kiểm tra đăng nhập ở đây.
 */
function UserLayout() {
  const { role } = useAuth();
  const navItems = role === ROLES.EMPLOYER || role === ROLES.ADMIN ? [...ACCOUNT_NAV, ...EMPLOYER_NAV] : ACCOUNT_NAV;

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f9fc]">
      <Header />

      <div className="mx-auto flex w-full max-w-[1180px] flex-1 gap-6 px-6 py-6">
        <aside className="h-fit w-[220px] shrink-0 rounded-[10px] border border-[#e1e6ef] bg-white p-3">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-[7px] px-3 py-2 text-[12px] no-underline transition ${
                      isActive ? "bg-[#eaf1ff] font-semibold text-[#063b91]" : "text-[#344054] hover:bg-[#f4f7fc]"
                    }`
                  }
                >
                  <Icon size={14} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0 flex-1 rounded-[10px] border border-[#e1e6ef] bg-white p-6">
          <Outlet />
        </section>
      </div>
    </div>
  );
}

export default UserLayout;

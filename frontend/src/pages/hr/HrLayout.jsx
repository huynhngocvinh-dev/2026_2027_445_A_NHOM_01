// Layout HR
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

function HrLayout() {
  const location = useLocation();

  // ================= ĐĂNG XUẤT =================
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa thông tin đăng nhập tạm thời
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Chuyển về trang đăng nhập
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Thông tin công ty",
      path: "/hr/company",
      icon: "▦",
    },
    {
      name: "Đăng tin tuyển dụng",
      path: "/hr/create-job",
      icon: "+",
    },
    {
      name: "Tin tuyển dụng",
      path: "/hr/jobs",
      icon: "▣",
    },
    {
      name: "Ứng viên",
      path: "/hr/candidates",
      icon: "♙",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        {/* ================= SIDEBAR ================= */}
        <aside className="flex w-[200px] shrink-0 flex-col bg-[#0f172a] text-white">
          {/* LOGO */}
          <div className="border-b border-slate-800 px-4 py-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm">
                💼
              </div>

              <span className="text-base font-bold">JobFinder</span>
            </div>

            <p className="mt-1 text-[11px] text-slate-400">Nhà tuyển dụng</p>
          </div>

          {/* MENU */}
          <nav className="flex-1 px-2 py-4">
            {menuItems.map((item) => {
              const active =
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + "/");

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mb-1 flex h-10 items-center gap-3 rounded-xl px-3 text-sm transition ${
                    active
                      ? "bg-blue-600 font-semibold text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="w-4 text-center text-sm">{item.icon}</span>

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* ACCOUNT */}
          <div className="border-t border-slate-800 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-xs font-bold">
                FP
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold">FPT Software</p>

                <p className="truncate text-[10px] text-slate-400">
                  hr@fpt.com.vn
                </p>
              </div>
            </div>

            {/* ================= NÚT ĐĂNG XUẤT ================= */}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 w-full rounded-xl border border-red-500 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500 hover:text-white"
            >
              Đăng xuất
            </button>
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <main className="min-w-0 flex-1">
          {/* HEADER */}
          <header className="flex h-[52px] items-center justify-end border-b border-slate-200 bg-white px-6">
            <div className="relative cursor-pointer text-lg">
              🔔
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </div>
          </header>

          {/* PAGE */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default HrLayout;

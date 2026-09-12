import { Link, Outlet, useLocation } from "react-router-dom";

function AdminLayout() {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
    },
    {
      name: "Quản lý người dùng",
      path: "/admin/users",
    },
    {
      name: "Tin tuyển dụng",
      path: "/admin/jobs",
    },
    {
      name: "Dữ liệu thu thập",
      path: "/admin/crawl",
    },
    {
      name: "Nguồn tuyển dụng",
      path: "/admin/sources",
    },
    {
      name: "Tin trùng lặp",
      path: "/admin/duplicates",
    },
    {
      name: "Ứng tuyển",
      path: "/admin/applications",
    },
    {
      name: "Thống kê",
      path: "/admin/statistics",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        {/* ================= SIDEBAR ================= */}
        <aside className="flex w-72 shrink-0 flex-col bg-slate-950 text-white">
          {/* LOGO */}
          <div className="border-b border-slate-800 px-6 py-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                💼
              </div>

              <span className="text-xl font-bold">JobFinder</span>
            </div>

            <p className="mt-2 text-sm text-slate-400">Quản trị viên</p>
          </div>

          {/* ================= MENU ================= */}
          <nav className="flex-1 px-3 py-4">
            {menuItems.map((item) => {
              const active =
                item.path === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mb-1 flex h-12 items-center gap-4 rounded-2xl px-4 text-base transition ${
                    active
                      ? "bg-blue-600 font-semibold text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* ================= ADMIN ACCOUNT ================= */}
          <div className="border-t border-slate-800 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold">
                AD
              </div>

              <div>
                <p className="text-sm font-semibold">Admin System</p>

                <p className="text-xs text-slate-400">admin@jobfinder.vn</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ================= PHẦN TRANG ================= */}
        <main className="min-w-0 flex-1">
          {/* HEADER */}
          <header className="flex h-18 items-center justify-end border-b border-slate-200 bg-white px-8">
            <span className="text-xl">🔔</span>
          </header>

          {/* TRANG CON HIỂN THỊ Ở ĐÂY */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

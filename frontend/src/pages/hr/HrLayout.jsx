import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiPlusCircle,
  FiBriefcase,
  FiUsers,
  FiBell,
  FiLogOut,
} from "react-icons/fi";

const API_BASE_URL = "http://localhost:8080/api/v1/company";

function HrLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // State lưu thông tin User HR & Công ty
  const [user, setUser] = useState(null);
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Đảm bảo lấy đúng ID cho dù backend/auth lưu dưới dạng id hay userId
        const currentHrId = parsedUser.id || parsedUser.userId;
        if (currentHrId) {
          fetchCompanyHeader(currentHrId);
        }
      } catch (error) {
        console.error("Lỗi parse thông tin user:", error);
      }
    }
  }, []);

  const fetchCompanyHeader = async (hrId) => {
    try {
      const res = await fetch(API_BASE_URL, {
        headers: { "X-HR-User-Id": hrId },
      });
      if (res.ok) {
        const data = await res.json();
        setCompanyInfo({
          name: data.name || "",
          email: data.email || "",
        });
      }
    } catch (error) {
      console.error("Không thể tải thông tin công ty cho Layout:", error);
    }
  };

  // ================= ĐĂNG XUẤT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Danh sách Menu
  const menuItems = [
    {
      name: "Thông tin công ty",
      path: "/hr/company",
      icon: <FiGrid size={18} />,
    },
    {
      name: "Đăng tin tuyển dụng",
      path: "/hr/create",
      icon: <FiPlusCircle size={18} />,
    },
    {
      name: "Tin tuyển dụng",
      path: "/hr/jobs",
      icon: <FiBriefcase size={18} />,
    },
    {
      name: "Ứng viên",
      path: "/hr/candidates",
      icon: <FiUsers size={18} />,
    },
  ];

  // Helper tạo Avatar Chữ cái đầu
  const getAvatarText = (name) => {
    if (!name) return "HR";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const displayName = companyInfo.name || user?.fullName || "Chưa cập nhật tên";
  const displayEmail =
    companyInfo.email || user?.email || "Chưa cập nhật email";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        {/* ================= SIDEBAR ================= */}
        <aside className="sticky top-0 flex h-screen w-[240px] shrink-0 flex-col bg-[#0f172a] text-white">
          {/* LOGO */}
          <div className="border-b border-slate-800/80 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <FiBriefcase size={20} />
              </div>

              <div>
                <span className="block text-base font-bold tracking-wide">
                  JobFinder
                </span>
                <p className="text-[10px] font-medium text-slate-400">
                  Portal Nhà tuyển dụng
                </p>
              </div>
            </div>
          </div>

          {/* MENU */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {menuItems.map((item) => {
              const active =
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + "/");

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <span className="flex items-center justify-center">
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* ACCOUNT INFO (TỐI ƯU CHO LAPTOP) */}
          <div className="border-t border-slate-800/80 p-3.5 bg-slate-900/50">
            <div className="flex items-center gap-3 rounded-xl bg-slate-800/40 p-2.5 border border-slate-700/40">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-orange-600 to-amber-500 text-xs font-bold text-white shadow-sm">
                {getAvatarText(displayName)}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-xs font-semibold text-slate-100"
                  title={displayName}
                >
                  {displayName}
                </p>

                <p
                  className="truncate text-[11px] text-slate-400"
                  title={displayEmail}
                >
                  {displayEmail}
                </p>
              </div>
            </div>

            {/* NÚT ĐĂNG XUẤT */}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-2 text-xs font-medium text-red-400 transition-all hover:bg-red-500 hover:text-white hover:shadow-sm"
            >
              <FiLogOut size={14} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <main className="min-w-0 flex-1">
          {/* HEADER */}
          <header className="sticky top-0 z-10 flex h-[52px] items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-sm">
            <div className="text-sm font-medium text-slate-500">
              Xin chào,{" "}
              <span className="font-semibold text-slate-800">
                {user?.fullName || "Nhà tuyển dụng"}
              </span>
            </div>

            <div className="relative cursor-pointer text-slate-600 transition-colors hover:text-blue-600">
              <FiBell size={19} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </div>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default HrLayout;

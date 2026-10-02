import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiBell,
  FiUser,
  FiHeart,
  FiLogOut,
  FiChevronDown,
  FiSearch,
  FiCheckSquare,
  FiTrendingUp,
  FiGrid,
  FiFileText,
  FiLayout,
  FiEdit,
  FiDollarSign,
  FiShield,
  FiPieChart,
  FiMessageCircle,
  FiCompass,
  FiActivity,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../constants/roles";

const NAV_ITEMS = [
  {
    label: "Việc làm",
    to: "/jobs",
    hasDropdown: true,
    dropdown: [
      {
        title: "VIỆC LÀM",
        links: [
          {
            icon: <FiSearch size={18} />,
            label: "Tìm việc làm",
            to: "/jobs",
            active: true,
          },
          {
            icon: <FiHeart size={18} />,
            label: "Việc làm đã lưu",
            to: "/account/saved-jobs",
          },
          {
            icon: <FiCheckSquare size={18} />,
            label: "Việc làm đã ứng tuyển",
            to: "/account/applied-jobs",
          },
          {
            icon: <FiTrendingUp size={18} />,
            label: "Việc làm hấp dẫn",
            to: "/jobs/hot",
          },
        ],
      },
      {
        title: "CÔNG TY",
        links: [
          {
            icon: <FiGrid size={18} />,
            label: "Danh sách công ty",
            to: "/companies",
          },
        ],
      },
    ],
  },
  {
    label: "Tạo CV",
    to: "/cv",
    hasDropdown: true,
    dropdown: [
      {
        title: "HỒ SƠ ỨNG VIÊN",
        links: [
          {
            icon: <FiFileText size={18} />,
            label: "Quản lý CV",
            to: "/cv/manage",
          },
          {
            icon: <FiLayout size={18} />,
            label: "Mẫu CV sinh viên",
            to: "/cv/templates",
          },
          {
            icon: <FiEdit size={18} />,
            label: "Hướng dẫn viết CV",
            to: "/cv/guide",
          },
        ],
      },
    ],
  },
  {
    label: "Công cụ",
    to: "/tools",
    hasDropdown: true,
    dropdown: [
      {
        title: "TIỆN ÍCH TÀI CHÍNH",
        links: [
          {
            icon: <FiDollarSign size={18} />,
            label: "Tính lương Gross - Net",
            to: "/tools/gross-net",
          },
          {
            icon: <FiShield size={18} />,
            label: "Tính bảo hiểm thất nghiệp",
            to: "/tools/insurance",
          },
          {
            icon: <FiPieChart size={18} />,
            label: "Tính thuế thu nhập (PIT)",
            to: "/tools/tax",
          },
        ],
      },
    ],
  },
  {
    label: "Cẩm nang",
    to: "/blog",
    hasDropdown: true,
    dropdown: [
      {
        title: "PHÁT TRIỂN SỰ NGHIỆP",
        links: [
          {
            icon: <FiMessageCircle size={18} />,
            label: "Kinh nghiệm phỏng vấn",
            to: "/blog/interview",
          },
          {
            icon: <FiCompass size={18} />,
            label: "Định hướng nghề nghiệp",
            to: "/blog/career",
          },
          {
            icon: <FiActivity size={18} />,
            label: "Báo cáo thị trường lao động",
            to: "/blog/market",
          },
        ],
      },
    ],
  },
];

function Header({ navItems = NAV_ITEMS }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [guestMenuOpen, setGuestMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const visibleNavItems = navItems.filter(
    (item) => !item.requireAuth || isAuthenticated,
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
        <div className="h-[72px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 no-underline mr-6">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <FiBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              JobFinder
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-2 mr-auto h-full">
            {visibleNavItems.map((item) => (
              <div
                key={item.to}
                className="relative group h-full flex items-center"
              >
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-full text-sm font-medium transition ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`
                  }
                >
                  {item.label}
                  {item.hasDropdown && (
                    <FiChevronDown className="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" />
                  )}
                </NavLink>

                {item.hasDropdown && item.dropdown && (
                  <div className="absolute left-0 top-[60px] hidden group-hover:block w-[280px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 py-2 z-50">
                    <div className="absolute top-[-20px] left-0 w-full h-[20px] bg-transparent"></div>

                    {item.dropdown.map((section, idx) => (
                      <div
                        key={section.title}
                        className={
                          idx !== 0 ? "mt-2 pt-2 border-t border-gray-50" : ""
                        }
                      >
                        <p className="px-5 py-1 text-[11px] font-bold text-gray-400 tracking-wider">
                          {section.title}
                        </p>
                        <div className="flex flex-col px-2 mt-1">
                          {section.links.map((link) => (
                            <Link
                              key={link.label}
                              to={link.to}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                link.active
                                  ? "bg-blue-50 text-blue-600"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                              }`}
                            >
                              <span
                                className={
                                  link.active
                                    ? "text-blue-600"
                                    : "text-gray-400"
                                }
                              >
                                {link.icon}
                              </span>
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setGuestMenuOpen(!guestMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 border border-blue-600 rounded-full bg-blue-50 hover:bg-blue-100 transition text-blue-700"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                    <FiUser size={16} />
                  </div>
                  <span className="text-sm font-semibold">Đăng ký</span>
                  <FiChevronDown size={16} />
                </button>

                {guestMenuOpen && (
                  <div className="absolute right-0 top-11 w-[200px] rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
                    <button
                      onClick={() => {
                        navigate("/login");
                        setGuestMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium"
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        setGuestMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium"
                    >
                      Đăng ký ứng viên mới
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition"
                >
                  <FiBell size={20} />
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 border border-transparent hover:border-gray-200 rounded-full bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <FiUser size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate hidden sm:block">
                      {user?.fullName || user?.email || "Tài khoản"}
                    </span>
                    <FiChevronDown size={16} className="text-gray-500" />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-11 w-[220px] rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
                      <p className="truncate px-4 pb-2 pt-1 text-xs font-semibold text-gray-900 border-b border-gray-100 mb-1">
                        {user?.fullName || user?.email}
                      </p>
                      <Link
                        to="/account/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 no-underline hover:bg-gray-50 hover:text-blue-600"
                      >
                        <FiUser size={16} /> Hồ sơ của tôi
                      </Link>
                      <Link
                        to="/account/saved-jobs"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 no-underline hover:bg-gray-50 hover:text-blue-600"
                      >
                        <FiHeart size={16} /> Việc làm đã lưu
                      </Link>
                      {user?.role === ROLES.ADMIN && (
                        <Link
                          to="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 no-underline hover:bg-gray-50 hover:text-blue-600"
                        >
                          <FiBriefcase size={16} /> Trang quản trị
                        </Link>
                      )}
                      <div className="h-px bg-gray-100 my-1"></div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <FiLogOut size={16} /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

//Quản lý người dùng
import { useState } from "react";

function UserManagementPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "an.nguyen@gmail.com",
      role: "Ứng viên",
      status: "Hoạt động",
      createdAt: "15/01/2024",
      avatar: "NA",
      avatarColor: "bg-blue-500",
    },
    {
      id: 2,
      name: "Trần Thị Bảo",
      email: "bao.tran@gmail.com",
      role: "Ứng viên",
      status: "Hoạt động",
      createdAt: "20/01/2024",
      avatar: "TB",
      avatarColor: "bg-purple-500",
    },
    {
      id: 3,
      name: "FPT Software HR",
      email: "hr@fpt.com.vn",
      role: "Nhà tuyển dụng",
      status: "Hoạt động",
      createdAt: "05/01/2024",
      avatar: "FP",
      avatarColor: "bg-orange-500",
    },
    {
      id: 4,
      name: "VNG HR Team",
      email: "hr@vng.com.vn",
      role: "Nhà tuyển dụng",
      status: "Hoạt động",
      createdAt: "10/01/2024",
      avatar: "VN",
      avatarColor: "bg-purple-500",
    },
    {
      id: 5,
      name: "Lê Minh Quân",
      email: "quan.le@gmail.com",
      role: "Ứng viên",
      status: "Đã khóa",
      createdAt: "25/01/2024",
      avatar: "LQ",
      avatarColor: "bg-green-500",
    },
    {
      id: 6,
      name: "Admin System",
      email: "admin@jobfinder.vn",
      role: "Admin",
      status: "Hoạt động",
      createdAt: "01/01/2024",
      avatar: "AD",
      avatarColor: "bg-blue-600",
    },
  ]);

  // =========================
  // STATE
  // =========================
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [dateFilter, setDateFilter] = useState("");

  // =========================
  // LỌC DỮ LIỆU
  // =========================
  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    const matchSearch =
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText);

    let matchRole = true;

    if (activeTab === "Ứng viên") {
      matchRole = user.role === "Ứng viên";
    }

    if (activeTab === "Nhà tuyển dụng") {
      matchRole = user.role === "Nhà tuyển dụng";
    }

    if (activeTab === "Admin") {
      matchRole = user.role === "Admin";
    }

    let matchStatus = true;

    if (statusFilter !== "Tất cả trạng thái") {
      matchStatus = user.status === statusFilter;
    }

    return matchSearch && matchRole && matchStatus;
  });

  // =========================
  // KHÓA / MỞ KHÓA
  // =========================
  const handleLockUser = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Hoạt động" ? "Đã khóa" : "Hoạt động",
            }
          : user,
      ),
    );
  };

  // =========================
  // XÓA NGƯỜI DÙNG
  // =========================
  const handleDeleteUser = (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa người dùng này?",
    );

    if (!confirmDelete) return;

    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  // =========================
  // XEM NGƯỜI DÙNG
  // =========================
  const handleViewUser = (user) => {
    alert(
      `Thông tin người dùng:\n\nTên: ${user.name}\nEmail: ${user.email}\nVai trò: ${user.role}\nTrạng thái: ${user.status}`,
    );
  };

  // =========================
  // THÊM NGƯỜI DÙNG
  // =========================
  const handleAddUser = () => {
    alert("Chức năng thêm người dùng sẽ kết nối API sau.");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* ==================================================
                    CONTENT
          ================================================== */}
      <section className="p-7">
        {/* ==================================================
                    TITLE + ADD BUTTON
            ================================================== */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[31px] font-bold text-slate-950">
              Quản lý người dùng
            </h1>

            <p className="mt-1 text-[17px] text-slate-500">
              {users.length} người dùng
            </p>
          </div>

          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-[17px] font-semibold text-white transition hover:bg-blue-700"
          >
            <span className="text-xl">+</span>
            Thêm người dùng
          </button>
        </div>

        {/* ==================================================
                    TABS
            ================================================== */}
        <div className="mt-7 border-b border-slate-200">
          <div className="flex gap-8">
            {["Tất cả", "Ứng viên", "Nhà tuyển dụng", "Admin"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-5 pb-4 text-[17px] font-medium transition ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-blue-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ==================================================
                    FILTER
            ================================================== */}
        <div className="mt-6 flex gap-3">
          {/* SEARCH */}
          <div className="relative w-[413px]">
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" strokeWidth="2" />

              <path strokeLinecap="round" strokeWidth="2" d="M20 20l-4-4" />
            </svg>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm người dùng..."
              className="h-11 w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* STATUS */}
          <div className="relative w-[166px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 w-full appearance-none rounded-2xl border border-slate-300 bg-white px-5 pr-10 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Tất cả trạng thái</option>
              <option>Hoạt động</option>
              <option>Đã khóa</option>
            </select>

            <svg
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 9l6 6 6-6"
              />
            </svg>
          </div>

          {/* DATE */}
          <div className="relative w-[166px]">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* ==================================================
                    TABLE
            ================================================== */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              {/* TABLE HEADER */}
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-[14px] font-semibold text-slate-500">
                    NGƯỜI DÙNG
                  </th>

                  <th className="px-5 py-4 text-left text-[14px] font-semibold text-slate-500">
                    EMAIL
                  </th>

                  <th className="px-5 py-4 text-left text-[14px] font-semibold text-slate-500">
                    VAI TRÒ
                  </th>

                  <th className="px-5 py-4 text-left text-[14px] font-semibold text-slate-500">
                    TRẠNG THÁI
                  </th>

                  <th className="px-5 py-4 text-left text-[14px] font-semibold text-slate-500">
                    NGÀY TẠO
                  </th>

                  <th className="px-5 py-4"></th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                    >
                      {/* USER */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${user.avatarColor} font-semibold text-white`}
                          >
                            {user.avatar}
                          </div>

                          <div className="max-w-[170px] truncate text-[16px] font-medium text-slate-900">
                            {user.name}
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="px-5 py-4">
                        <span className="text-[15px] text-slate-700">
                          {user.email}
                        </span>
                      </td>

                      {/* ROLE */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-[13px] font-medium ${
                            user.role === "Ứng viên"
                              ? "bg-sky-100 text-sky-700"
                              : user.role === "Nhà tuyển dụng"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-[13px] font-medium ${
                            user.status === "Hoạt động"
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="px-5 py-4">
                        <span className="text-[14px] text-slate-400">
                          {user.createdAt}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-5 whitespace-nowrap">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="font-medium text-blue-600 hover:text-blue-800"
                          >
                            Xem
                          </button>

                          <button
                            onClick={() => handleLockUser(user.id)}
                            className={`font-medium ${
                              user.status === "Hoạt động"
                                ? "text-orange-500 hover:text-orange-700"
                                : "text-green-600 hover:text-green-800"
                            }`}
                          >
                            {user.status === "Hoạt động" ? "Khóa" : "Mở khóa"}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="font-medium text-red-500 hover:text-red-700"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-12 text-center text-slate-400"
                    >
                      Không tìm thấy người dùng
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ==================================================
                        PAGINATION
              ================================================== */}
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
            <span className="text-sm text-slate-500">
              Hiển thị {filteredUsers.length} / {users.length} người dùng
            </span>

            <div className="flex items-center gap-2">
              <button className="h-9 w-9 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-100">
                ‹
              </button>

              <button className="h-9 w-9 rounded-lg bg-blue-600 text-white">
                1
              </button>

              <button className="h-9 w-9 rounded-lg border border-slate-200 hover:bg-slate-100">
                2
              </button>

              <button className="h-9 w-9 rounded-lg border border-slate-200 hover:bg-slate-100">
                ›
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UserManagementPage;

// Quản lý ứng tuyển
import { useState } from "react";

const initialApplications = [
  {
    id: 1,
    candidateName: "Nguyễn Văn An",
    avatarBg: "bg-blue-600",
    avatarText: "NA",
    employer: "FPT Software",
    jobTitle: "Java Backend Developer",
    appliedDate: "15/03/2024",
    status: "Đang xem xét",
    statusStyle: "bg-amber-100 text-amber-700",
  },
  {
    id: 2,
    candidateName: "Trần Thị Bảo",
    avatarBg: "bg-purple-600",
    avatarText: "TB",
    employer: "VNG Corporation",
    jobTitle: "React Frontend Developer",
    appliedDate: "16/03/2024",
    status: "Phỏng vấn",
    statusStyle: "bg-blue-600 text-white rounded-full px-3",
  },
  {
    id: 3,
    candidateName: "Phạm Minh Cường",
    avatarBg: "bg-emerald-600",
    avatarText: "PC",
    employer: "MoMo",
    jobTitle: "Data Analyst",
    appliedDate: "14/03/2024",
    status: "Đã nộp",
    statusStyle: "bg-sky-100 text-sky-700",
  },
  {
    id: 4,
    candidateName: "Lê Thị Dung",
    avatarBg: "bg-orange-500",
    avatarText: "LD",
    employer: "Shopee Vietnam",
    jobTitle: "UI/UX Designer",
    appliedDate: "10/03/2024",
    status: "Đã nhận",
    statusStyle: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 5,
    candidateName: "Hoàng Văn Em",
    avatarBg: "bg-red-500",
    avatarText: "HE",
    employer: "Grab Vietnam",
    jobTitle: "DevOps Engineer",
    appliedDate: "08/03/2024",
    status: "Từ chối",
    statusStyle: "bg-rose-100 text-rose-700",
  },
];

function ApplicationManagementPage() {
  const [applications, setApplications] = useState(initialApplications);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployer, setSelectedEmployer] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Hàm xử lý xóa ứng tuyển
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hồ sơ ứng tuyển này?")) {
      setApplications(applications.filter((item) => item.id !== id));
    }
  };

  // Lọc dữ liệu theo các trường tìm kiếm
  const filteredData = applications.filter((item) => {
    const matchName = item.candidateName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchEmployer = selectedEmployer
      ? item.employer === selectedEmployer
      : true;
    const matchJob = selectedJob ? item.jobTitle === selectedJob : true;
    const matchStatus = selectedStatus ? item.status === selectedStatus : true;

    return matchName && matchEmployer && matchJob && matchStatus;
  });

  return (
    <div className="p-8 space-y-6 bg-slate-100 min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quản lý ứng tuyển</h1>
        <p className="text-sm text-slate-500 mt-1">
          <span className="font-medium text-slate-700">
            320 ứng tuyển hôm nay
          </span>{" "}
          · 2.450 tổng cộng
        </p>
      </div>

      {/* thanh lọc thông tin */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Tìm kiếm */}
        <div className="relative flex-1 min-w-[220px] max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Tìm ứng viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Lọc nhà tuyển dụng */}
        <select
          value={selectedEmployer}
          onChange={(e) => setSelectedEmployer(e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2 pr-8 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả nhà tuyển dụng</option>
          <option value="FPT Software">FPT Software</option>
          <option value="VNG Corporation">VNG Corporation</option>
          <option value="MoMo">MoMo</option>
          <option value="Shopee Vietnam">Shopee Vietnam</option>
          <option value="Grab Vietnam">Grab Vietnam</option>
        </select>

        {/* Lọc công việc */}
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2 pr-8 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả công việc</option>
          <option value="Java Backend Developer">Java Backend Developer</option>
          <option value="React Frontend Developer">
            React Frontend Developer
          </option>
          <option value="Data Analyst">Data Analyst</option>
          <option value="UI/UX Designer">UI/UX Designer</option>
          <option value="DevOps Engineer">DevOps Engineer</option>
        </select>

        {/* Lọc trạng thái */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2 pr-8 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Đang xem xét">Đang xem xét</option>
          <option value="Phỏng vấn">Phỏng vấn</option>
          <option value="Đã nộp">Đã nộp</option>
          <option value="Đã nhận">Đã nhận</option>
          <option value="Từ chối">Từ chối</option>
        </select>

        {/* Lọc Ngày */}
        <div className="relative">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* BẢNG DANH SÁCH */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                <th className="py-4 px-6">ỨNG VIÊN</th>
                <th className="py-4 px-6">NHÀ TUYỂN DỤNG</th>
                <th className="py-4 px-6">CÔNG VIỆC</th>
                <th className="py-4 px-6">NGÀY ỨNG TUYỂN</th>
                <th className="py-4 px-6">TRẠNG THÁI</th>
                <th className="py-4 px-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {/* Ứng viên */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full ${item.avatarBg} text-white font-semibold text-xs flex items-center justify-center shrink-0`}
                      >
                        {item.avatarText}
                      </div>
                      <span className="font-semibold text-slate-800">
                        {item.candidateName}
                      </span>
                    </div>
                  </td>

                  {/* Nhà tuyển dụng */}
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {item.employer}
                  </td>

                  {/* Công việc */}
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {item.jobTitle}
                  </td>

                  {/* Ngày ứng tuyển */}
                  <td className="py-4 px-6 text-slate-500 text-xs">
                    {item.appliedDate}
                  </td>

                  {/* Trạng thái */}
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${item.statusStyle}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Hành động (Xem / Xóa) */}
                  <td className="py-4 px-6 text-right space-x-4 text-xs font-medium">
                    <button
                      onClick={() =>
                        alert(`Xem chi tiết ứng viên: ${item.candidateName}`)
                      }
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Xem
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="py-8 text-center text-slate-400 text-sm"
                  >
                    Không tìm thấy ứng tuyển phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ApplicationManagementPage;

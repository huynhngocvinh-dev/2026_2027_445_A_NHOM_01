// Tin Tuyển Dụng
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HrJobsPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Java Backend Developer",
      type: "Toàn thời gian",
      salary: "20 - 35 triệu",
      location: "Hà Nội",
      candidates: 12,
      status: "Đang tuyển",
      date: "15/03/2024",
    },
    {
      id: 2,
      title: "React Frontend Developer",
      type: "Toàn thời gian",
      salary: "25 - 40 triệu",
      location: "TP. Hồ Chí Minh",
      candidates: 24,
      status: "Đang tuyển",
      date: "15/03/2024",
    },
    {
      id: 3,
      title: "Product Manager",
      type: "Toàn thời gian",
      salary: "40 - 60 triệu",
      location: "TP. Hồ Chí Minh",
      candidates: 36,
      status: "Đang tuyển",
      date: "15/03/2024",
    },
    {
      id: 4,
      title: "UI/UX Designer",
      type: "Toàn thời gian",
      salary: "18 - 28 triệu",
      location: "TP. Hồ Chí Minh",
      candidates: 48,
      status: "Đang tuyển",
      date: "15/03/2024",
    },
    {
      id: 5,
      title: "Data Analyst",
      type: "Toàn thời gian",
      salary: "22 - 35 triệu",
      location: "TP. Hồ Chí Minh",
      candidates: 60,
      status: "Đã đóng",
      date: "15/03/2024",
    },
    {
      id: 6,
      title: "DevOps Engineer",
      type: "Remote",
      salary: "35 - 50 triệu",
      location: "Remote",
      candidates: 72,
      status: "Đã đóng",
      date: "15/03/2024",
    },
  ]);

  const filteredJobs = jobs.filter((job) => {
    const matchSearch = job.title.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "Tất cả trạng thái" || job.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const deleteJob = (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa tin tuyển dụng này?",
    );

    if (!confirmDelete) return;

    setJobs(jobs.filter((job) => job.id !== id));
  };

  return (
    <div className="min-h-[calc(100vh-52px)] bg-slate-50 p-5">
      {/* HEADER */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            Tin tuyển dụng của tôi
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {jobs.length} tin tuyển dụng
          </p>
        </div>

        <button
          onClick={() => navigate("/hr/create-job")}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          ＋ Đăng tin tuyển dụng
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {/* FILTER */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 p-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Tìm kiếm tin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-64 rounded-full border border-slate-300 pl-9 pr-3 text-xs outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 rounded-full border border-slate-300 px-3 text-xs outline-none"
          >
            <option>Tất cả trạng thái</option>
            <option>Đang tuyển</option>
            <option>Đã đóng</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-[11px] uppercase text-slate-500">
                <th className="px-4 py-3 font-medium">Công việc</th>

                <th className="px-4 py-3 font-medium">Mức lương</th>

                <th className="px-4 py-3 font-medium">Địa điểm</th>

                <th className="px-4 py-3 font-medium">Ứng viên</th>

                <th className="px-4 py-3 font-medium">Xác minh</th>

                <th className="px-4 py-3 font-medium">Trạng thái</th>

                <th className="px-4 py-3 font-medium">Ngày tạo</th>

                <th className="px-4 py-3 font-medium">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredJobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-4 py-4">
                    <div className="text-sm font-semibold text-slate-900">
                      {job.title}
                    </div>

                    <div className="mt-1 text-[11px] text-slate-400">
                      {job.type}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-xs text-slate-700">
                    {job.salary}
                  </td>

                  <td className="px-4 py-4 text-xs text-slate-700">
                    {job.location}
                  </td>

                  <td className="px-4 py-4 text-xs font-medium">
                    {job.candidates}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] text-blue-600">
                      ✓ Đã xác minh
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] ${
                        job.status === "Đang tuyển"
                          ? "bg-green-50 text-green-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-[11px] text-slate-400">
                    {job.date}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex gap-3 text-[11px]">
                      <button
                        onClick={() => alert(`Chỉnh sửa: ${job.title}`)}
                        className="text-blue-600 hover:underline"
                      >
                        Sửa
                      </button>

                      <button
                        onClick={() => alert(`Xem: ${job.title}`)}
                        className="text-slate-600 hover:underline"
                      >
                        Xem
                      </button>

                      <button
                        onClick={() => deleteJob(job.id)}
                        className="text-red-500 hover:underline"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HrJobsPage;

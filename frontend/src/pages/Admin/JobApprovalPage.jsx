//Tin Tuyển Dụng
import { useState } from "react";

function JobApprovalPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [sourceFilter, setSourceFilter] = useState("Tất cả nguồn");

  const [jobs, setJobs] = useState([
    {
      id: 1,
      job: "Java Backend Developer",
      company: "FPT Software",
      logo: "FP",
      logoColor: "bg-orange-500",
      location: "Hà Nội",
      salary: "20 - 35 triệu",
      source: "Topcv",
      verify: "Đã xác minh",
      status: "Đang tuyển",
      date: "20/03/2024",
    },
    {
      id: 2,
      job: "React Frontend Developer",
      company: "VNG Corporation",
      logo: "VN",
      logoColor: "bg-purple-500",
      location: "TP. Hồ Chí Minh",
      salary: "25 - 40 triệu",
      source: "LinkedIn",
      verify: "Đã xác minh",
      status: "Đang chờ",
      date: "20/03/2024",
    },
    {
      id: 3,
      job: "Product Manager",
      company: "Tiki",
      logo: "TK",
      logoColor: "bg-red-500",
      location: "TP. Hồ Chí Minh",
      salary: "40 - 60 triệu",
      source: "Topcv",
      verify: "Đã xác minh",
      status: "Đang tuyển",
      date: "20/03/2024",
    },
    {
      id: 4,
      job: "UI/UX Designer",
      company: "Shopee Vietnam",
      logo: "SP",
      logoColor: "bg-orange-500",
      location: "TP. Hồ Chí Minh",
      salary: "18 - 28 triệu",
      source: "Facebook",
      verify: "Đã xác minh",
      status: "Đã đóng",
      date: "20/03/2024",
    },
    {
      id: 5,
      job: "Data Analyst",
      company: "MoMo",
      logo: "MM",
      logoColor: "bg-purple-500",
      location: "TP. Hồ Chí Minh",
      salary: "22 - 35 triệu",
      source: "Topcv",
      verify: "Đã xác minh",
      status: "Đang tuyển",
      date: "20/03/2024",
    },
    {
      id: 6,
      job: "DevOps Engineer",
      company: "Grab Vietnam",
      logo: "GR",
      logoColor: "bg-green-500",
      location: "Remote",
      salary: "35 - 50 triệu",
      source: "LinkedIn",
      verify: "Đã xác minh",
      status: "Đang tuyển",
      date: "20/03/2024",
    },
    {
      id: 7,
      job: "iOS Developer",
      company: "Viettel Group",
      logo: "VT",
      logoColor: "bg-red-500",
      location: "Hà Nội",
      salary: "25 - 40 triệu",
      source: "Việc làm tốt",
      verify: "Chờ xác minh",
      status: "Từ chối",
      date: "20/03/2024",
    },
    {
      id: 8,
      job: "Business Analyst",
      company: "Zalopay",
      logo: "ZP",
      logoColor: "bg-blue-500",
      location: "TP. Hồ Chí Minh",
      salary: "20 - 30 triệu",
      source: "Topcv",
      verify: "Chờ xác minh",
      status: "Đang tuyển",
      date: "20/03/2024",
    },
  ]);

  // DUYỆT TIN
  const handleApprove = (id) => {
    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === id
          ? {
              ...job,
              status: "Đang tuyển",
              verify: "Đã xác minh",
            }
          : job,
      ),
    );
  };

  // TỪ CHỐI TIN
  const handleReject = (id) => {
    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === id
          ? {
              ...job,
              status: "Từ chối",
            }
          : job,
      ),
    );
  };

  // LỌC
  const filteredJobs = jobs.filter((job) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      job.job.toLowerCase().includes(keyword) ||
      job.company.toLowerCase().includes(keyword);

    const matchStatus =
      statusFilter === "Tất cả trạng thái" || job.status === statusFilter;

    const matchSource =
      sourceFilter === "Tất cả nguồn" || job.source === sourceFilter;

    return matchSearch && matchStatus && matchSource;
  });

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-100">
      <div className="p-8">
        {/* TIÊU ĐỀ */}
        <div className="mb-7">
          <h1 className="text-3xl font-bold text-slate-900">
            Quản lý tin tuyển dụng
          </h1>

          <p className="mt-2 text-base text-slate-500">
            {jobs.length} tin tuyển dụng
          </p>
        </div>

        {/* TÌM KIẾM + BỘ LỌC */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {/* SEARCH */}
          <div className="relative w-full max-w-[435px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm tin..."
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-slate-700 outline-none focus:border-blue-500"
            />
          </div>

          {/* STATUS */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-700 outline-none focus:border-blue-500"
          >
            <option>Tất cả trạng thái</option>
            <option>Đang tuyển</option>
            <option>Đang chờ</option>
            <option>Đã đóng</option>
            <option>Từ chối</option>
          </select>

          {/* SOURCE */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-slate-700 outline-none focus:border-blue-500"
          >
            <option>Tất cả nguồn</option>
            <option>Topcv</option>
            <option>LinkedIn</option>
            <option>Facebook</option>
            <option>Việc làm tốt</option>
          </select>
        </div>

        {/* BẢNG */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1300px]">
              {/* HEADER */}
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500">
                    CÔNG VIỆC
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-semibold text-slate-500">
                    CÔNG TY
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-semibold text-slate-500">
                    ĐỊA ĐIỂM
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-semibold text-slate-500">
                    MỨC LƯƠNG
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-semibold text-slate-500">
                    NGUỒN
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-semibold text-slate-500">
                    XÁC MINH
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-semibold text-slate-500">
                    TRẠNG THÁI
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-semibold text-slate-500">
                    NGÀY TẠO
                  </th>

                  <th className="px-4 py-4 text-left text-sm font-semibold text-slate-500">
                    THAO TÁC
                  </th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    {/* CÔNG VIỆC */}
                    <td className="px-6 py-5">
                      <p className="max-w-[220px] truncate font-semibold text-slate-900">
                        {job.job}
                      </p>
                    </td>

                    {/* CÔNG TY */}
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${job.logoColor} text-xs font-bold text-white`}
                        >
                          {job.logo}
                        </div>

                        <span className="max-w-[150px] truncate text-slate-700">
                          {job.company}
                        </span>
                      </div>
                    </td>

                    {/* ĐỊA ĐIỂM */}
                    <td className="px-4 py-5 text-slate-600">{job.location}</td>

                    {/* LƯƠNG */}
                    <td className="px-4 py-5 text-slate-600">{job.salary}</td>

                    {/* NGUỒN */}
                    <td className="px-4 py-5">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                        {job.source}
                      </span>
                    </td>

                    {/* XÁC MINH */}
                    <td className="px-4 py-5">
                      {job.verify === "Đã xác minh" ? (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-600">
                          ✓ Đã xác minh
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                          Chờ xác minh
                        </span>
                      )}
                    </td>

                    {/* TRẠNG THÁI */}
                    <td className="px-4 py-5">
                      {job.status === "Đang tuyển" && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600">
                          Đang tuyển
                        </span>
                      )}

                      {job.status === "Đang chờ" && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                          Đang chờ
                        </span>
                      )}

                      {job.status === "Đã đóng" && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                          Đã đóng
                        </span>
                      )}

                      {job.status === "Từ chối" && (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-600">
                          Từ chối
                        </span>
                      )}
                    </td>

                    {/* NGÀY */}
                    <td className="px-4 py-5 text-slate-400">{job.date}</td>

                    {/* THAO TÁC */}
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <button
                          onClick={() => alert(`Xem tin: ${job.job}`)}
                          className="text-blue-600 hover:underline"
                        >
                          Xem
                        </button>

                        <button
                          onClick={() => handleApprove(job.id)}
                          className="text-green-600 hover:underline"
                        >
                          Duyệt
                        </button>

                        <button
                          onClick={() => handleReject(job.id)}
                          className="text-red-500 hover:underline"
                        >
                          Từ chối
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* KHÔNG CÓ KẾT QUẢ */}
          {filteredJobs.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              Không tìm thấy tin tuyển dụng
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobApprovalPage;

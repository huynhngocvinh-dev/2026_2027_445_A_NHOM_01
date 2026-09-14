// Dữ liệu thu thập
function CrawlManagementPage() {
  const crawlData = [
    {
      id: 1,
      url: "https://topcv.vn/vi...",
      source: "TopCV",
      content: "Java Backend Developer tại ...",
      startDate: "20/03/2024",
      startTime: "08:30",
      status: "Đã phân tích",
      job: "Java Backend Developer - FPT Software",
      crawlDate: "20/03/2024",
      crawlTime: "09:00",
    },
    {
      id: 2,
      url: "https://linkedin.co...",
      source: "LinkedIn",
      content: "React Frontend Developer at ...",
      startDate: "20/03/2024",
      startTime: "07:15",
      status: "Đã phân tích",
      job: "React Frontend Developer - VNG",
      crawlDate: "20/03/2024",
      crawlTime: "08:00",
    },
    {
      id: 3,
      url: "https://facebook.co...",
      source: "Facebook",
      content: "Tuyển dụng UI/UX Designer...",
      startDate: "19/03/2024",
      startTime: "15:00",
      status: "Đang chờ",
      job: "-",
      crawlDate: "19/03/2024",
      crawlTime: "16:00",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-100 p-8 text-slate-900">
      {/* =====================================================
          TIÊU ĐỀ
      ====================================================== */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dữ liệu thu thập</h1>

        <p className="mt-2 text-lg text-slate-500">
          Quản lý dữ liệu thô từ các nguồn tuyển dụng
        </p>
      </div>

      {/* =====================================================
          STATISTICS
      ====================================================== */}
      <div className="mb-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Tổng dữ liệu"
          value="48.920"
          icon="◡"
          iconBg="bg-blue-50"
          iconText="text-blue-600"
        />

        <StatCard
          title="Đã xử lý"
          value="45.240"
          icon="✓"
          iconBg="bg-green-50"
          iconText="text-green-600"
        />

        <StatCard
          title="Đang chờ"
          value="2.480"
          icon="◷"
          iconBg="bg-orange-50"
          iconText="text-orange-500"
        />

        <StatCard
          title="Lỗi"
          value="1.200"
          icon="!"
          iconBg="bg-red-50"
          iconText="text-red-500"
        />
      </div>

      {/* =====================================================
          FILTER
      ====================================================== */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-3">
          <select className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-slate-600 outline-none">
            <option>Tất cả nguồn</option>
            <option>TopCV</option>
            <option>LinkedIn</option>
            <option>Facebook</option>
          </select>

          <select className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-slate-600 outline-none">
            <option>Tất cả trạng thái</option>
            <option>Đã phân tích</option>
            <option>Đang chờ</option>
            <option>Lỗi</option>
          </select>
        </div>

        <button
          onClick={() => alert("Bắt đầu chạy thu thập dữ liệu")}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Chạy thu thập
        </button>
      </div>

      {/* =====================================================
          DATA TABLE
      ====================================================== */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-sm text-slate-500">
                <th className="px-6 py-5 font-semibold">URL NGUỒN</th>

                <th className="px-6 py-5 font-semibold">NHÓM NGUỒN</th>

                <th className="px-6 py-5 font-semibold">NỘI DUNG THÔ</th>

                <th className="px-6 py-5 font-semibold">ĐĂNG LÚC</th>

                <th className="px-6 py-5 font-semibold">TRẠNG THÁI</th>

                <th className="px-6 py-5 font-semibold">TIN ĐÃ PHÂN TÍCH</th>

                <th className="px-6 py-5 font-semibold">NGÀY THU THẬP</th>

                <th className="px-6 py-5 font-semibold">#</th>
              </tr>
            </thead>

            <tbody>
              {crawlData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  {/* URL */}
                  <td className="px-6 py-6 text-blue-600">{item.url}</td>

                  {/* SOURCE */}
                  <td className="px-6 py-6">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                      {item.source}
                    </span>
                  </td>

                  {/* CONTENT */}
                  <td className="px-6 py-6 text-slate-600">{item.content}</td>

                  {/* START DATE + TIME */}
                  <td className="px-6 py-6 text-slate-500">
                    <div>{item.startDate}</div>

                    <div className="mt-1">{item.startTime}</div>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-6">
                    <span
                      className={`rounded-full px-3 py-2 text-sm ${
                        item.status === "Đã phân tích"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* ANALYZED JOB */}
                  <td className="px-6 py-6 font-medium text-green-700">
                    {item.job}
                  </td>

                  {/* CRAWL DATE */}
                  <td className="px-6 py-6 text-slate-500">
                    <div>{item.crawlDate}</div>

                    <div className="mt-1">{item.crawlTime}</div>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-6">
                    <button
                      onClick={() => alert(`Xem dữ liệu: ${item.url}`)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Xem
                    </button>
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

function StatCard({ title, value, icon, iconBg, iconText }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-lg text-slate-500">{title}</span>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full ${iconBg} ${iconText} text-xl font-bold`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-6 text-3xl font-bold">{value}</div>
    </div>
  );
}

export default CrawlManagementPage;

// Nguồn tuyển dụng
import { useState } from "react";

function SourceManagementPage() {
  const [sources, setSources] = useState([
    {
      id: 1,
      name: "Topcv",
      website: "topcv.vn",
      avatar: "TC",
      avatarColor: "bg-blue-500",
      jobs: "1,250",
      lastUpdate: "10:30",
      frequency: "Mỗi 30 phút",
      status: "Hoạt động",
    },
    {
      id: 2,
      name: "LinkedIn",
      website: "linkedin.com",
      avatar: "LI",
      avatarColor: "bg-sky-600",
      jobs: "890",
      lastUpdate: "09:45",
      frequency: "Mỗi 1 giờ",
      status: "Hoạt động",
    },
    {
      id: 3,
      name: "VietnamWorks",
      website: "vietnamworks.com",
      avatar: "VW",
      avatarColor: "bg-red-500",
      jobs: "2,100",
      lastUpdate: "11:00",
      frequency: "Mỗi 30 phút",
      status: "Hoạt động",
    },
    {
      id: 4,
      name: "ITviec",
      website: "itviec.com",
      avatar: "IT",
      avatarColor: "bg-purple-500",
      jobs: "450",
      lastUpdate: "08:00",
      frequency: "Mỗi 2 giờ",
      status: "Ngừng",
    },
    {
      id: 5,
      name: "Facebook Groups",
      website: "facebook.com",
      avatar: "FB",
      avatarColor: "bg-blue-600",
      jobs: "320",
      lastUpdate: "10:15",
      frequency: "Mỗi 2 giờ",
      status: "Hoạt động",
    },
    {
      id: 6,
      name: "Việc làm tốt",
      website: "vieclam.topcv.vn",
      avatar: "VT",
      avatarColor: "bg-orange-400",
      jobs: "680",
      lastUpdate: "09:30",
      frequency: "Mỗi 1 giờ",
      status: "Hoạt động",
    },
  ]);

  // =========================
  // TẠM DỪNG / KÍCH HOẠT
  // =========================
  const toggleSourceStatus = (id) => {
    setSources((currentSources) =>
      currentSources.map((source) =>
        source.id === id
          ? {
              ...source,
              status: source.status === "Hoạt động" ? "Ngừng" : "Hoạt động",
            }
          : source,
      ),
    );
  };

  // =========================
  // THÊM NGUỒN
  // =========================
  const handleAddSource = () => {
    alert("Chức năng thêm nguồn sẽ được kết nối API sau.");
  };

  // =========================
  // CHỈNH SỬA
  // =========================
  const handleEditSource = (source) => {
    alert(`Chỉnh sửa nguồn: ${source.name}`);
  };

  // =========================
  // KIỂM TRA KẾT NỐI
  // =========================
  const handleCheckConnection = (source) => {
    alert(`Đang kiểm tra kết nối ${source.name}`);
  };

  // =========================
  // CẬP NHẬT DỮ LIỆU
  // =========================
  const handleUpdateData = (source) => {
    alert(`Đang cập nhật dữ liệu ${source.name}`);
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-100 p-8 text-slate-900">
      {/* =====================================================
          TITLE
      ====================================================== */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">
            Quản lý nguồn tuyển dụng
          </h1>

          <p className="mt-2 text-lg text-slate-500">
            {sources.length} nguồn dữ liệu
          </p>
        </div>

        {/* ADD SOURCE */}
        <button
          onClick={handleAddSource}
          className="rounded-2xl bg-blue-600 px-6 py-3 text-[16px] font-semibold text-white transition hover:bg-blue-700"
        >
          + Thêm nguồn
        </button>
      </div>

      {/* =====================================================
          SOURCE CARDS
      ====================================================== */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {sources.map((source) => (
          <div
            key={source.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            {/* =================================================
                CARD HEADER
            ================================================== */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${source.avatarColor} text-base font-bold text-white`}
                >
                  {source.avatar}
                </div>

                {/* Name + Website */}
                <div>
                  <h2 className="text-[18px] font-bold text-slate-900">
                    {source.name}
                  </h2>

                  <p className="mt-0.5 text-sm text-slate-400">
                    {source.website}
                  </p>
                </div>
              </div>

              {/* STATUS */}
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  source.status === "Hoạt động"
                    ? "bg-green-100 text-green-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {source.status}
              </span>
            </div>

            {/* =================================================
                STATISTICS
            ================================================== */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              {/* Jobs */}
              <div className="rounded-2xl bg-slate-50 px-4 py-4 text-center">
                <div className="text-xl font-bold text-slate-900">
                  {source.jobs}
                </div>

                <div className="mt-1 text-sm text-slate-400">
                  Tin tuyển dụng
                </div>
              </div>

              {/* Last Update */}
              <div className="rounded-2xl bg-slate-50 px-4 py-4 text-center">
                <div className="text-xl font-bold text-slate-900">
                  {source.lastUpdate}
                </div>

                <div className="mt-1 text-sm text-slate-400">
                  Cập nhật lần cuối
                </div>
              </div>
            </div>

            {/* =================================================
                FREQUENCY
            ================================================== */}
            <div className="mt-5 text-[15px] text-slate-600">
              Tần suất thu thập:{" "}
              <span className="font-medium text-slate-700">
                {source.frequency}
              </span>
            </div>

            {/* =================================================
                ACTION BUTTONS
            ================================================== */}
            <div className="mt-5 flex flex-wrap gap-2">
              {/* Chỉnh sửa */}
              <button
                onClick={() => handleEditSource(source)}
                className="rounded-full border border-blue-300 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
              >
                Chỉnh sửa
              </button>

              {/* Kiểm tra kết nối */}
              <button
                onClick={() => handleCheckConnection(source)}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Kiểm tra kết nối
              </button>

              {/* Cập nhật dữ liệu */}
              <button
                onClick={() => handleUpdateData(source)}
                className="rounded-full border border-green-500 px-4 py-2 text-sm font-medium text-green-600 transition hover:bg-green-50"
              >
                Cập nhật dữ liệu
              </button>

              {/* Tạm dừng / Kích hoạt */}
              <button
                onClick={() => toggleSourceStatus(source.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  source.status === "Hoạt động"
                    ? "border-orange-400 text-orange-600 hover:bg-orange-50"
                    : "border-green-500 text-green-600 hover:bg-green-50"
                }`}
              >
                {source.status === "Hoạt động" ? "Tạm dừng" : "Kích hoạt"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SourceManagementPage;

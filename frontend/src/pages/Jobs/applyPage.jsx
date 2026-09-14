import { useState } from "react";
import {
  FiBriefcase,
  FiChevronDown,
  FiEye,
  FiX,
} from "react-icons/fi";

function ApplyPage() {
  const [activeTab, setActiveTab] = useState("Tất cả");

  const applications = [
    {
      id: 1,
      job: "Java Backend Developer",
      company: "FPT Software",
      date: "15/03/2024",
      status: "Đang xem xét",
      statusType: "review",
    },
    {
      id: 2,
      job: "React Frontend Developer",
      company: "VNG Corporation",
      date: "16/03/2024",
      status: "Phỏng vấn",
      statusType: "interview",
    },
    {
      id: 3,
      job: "Data Analyst",
      company: "MoMo",
      date: "14/03/2024",
      status: "Đã nộp",
      statusType: "submitted",
    },
    {
      id: 4,
      job: "UI/UX Designer",
      company: "Shopee Vietnam",
      date: "10/03/2024",
      status: "Đã nhận",
      statusType: "accepted",
    },
    {
      id: 5,
      job: "DevOps Engineer",
      company: "Grab Vietnam",
      date: "08/03/2024",
      status: "Từ chối",
      statusType: "rejected",
    },
  ];

  const tabs = [
    "Tất cả",
    "Đang xử lý",
    "Phỏng vấn",
    "Đã nhận",
    "Từ chối",
  ];

  const getStatusClass = (type) => {
    switch (type) {
      case "review":
        return "bg-orange-100 text-orange-600";

      case "interview":
        return "bg-blue-600 text-white";

      case "submitted":
        return "bg-sky-100 text-sky-600";

      case "accepted":
        return "bg-green-100 text-green-600";

      case "rejected":
        return "bg-red-100 text-red-500";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredApplications =
    activeTab === "Tất cả"
      ? applications
      : applications.filter((item) => {
          if (activeTab === "Đang xử lý") {
            return (
              item.statusType === "review" ||
              item.statusType === "submitted"
            );
          }

          if (activeTab === "Phỏng vấn") {
            return item.statusType === "interview";
          }

          if (activeTab === "Đã nhận") {
            return item.statusType === "accepted";
          }

          if (activeTab === "Từ chối") {
            return item.statusType === "rejected";
          }

          return true;
        });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900">

      {/* ================= HEADER ================= */}
      <header className="h-[53px] bg-white border-b border-gray-200">
        <div className="max-w-[1110px] mx-auto h-full px-5 flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
              <FiBriefcase
                size={15}
                className="text-white"
              />
            </div>

            <span className="text-[15px] font-bold text-gray-900">
              JobFinder
            </span>
          </div>

          {/* NAVIGATION */}
          <nav className="hidden md:flex items-center gap-1 h-full">

            <button
              className="px-4 py-2 text-[12px] text-gray-600 hover:text-blue-600"
            >
              Trang chủ
            </button>

            <button
              className="px-4 py-2 rounded-full bg-gray-100 text-[12px] font-medium text-gray-900"
            >
              Việc làm
            </button>

            <button
              className="px-4 py-2 text-[12px] text-gray-600 hover:text-blue-600"
            >
              Đề xuất
            </button>

            <button
              className="px-4 py-2 text-[12px] text-gray-600 hover:text-blue-600"
            >
              Yêu thích
            </button>

            <button
              className="px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-[12px] font-medium"
            >
              Ứng tuyển
            </button>
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-5">
            <button className="text-[12px] text-gray-700 hover:text-blue-600">
              Đăng nhập
            </button>

            <button
              className="
                px-4
                py-2
                rounded-full
                bg-blue-600
                hover:bg-blue-700
                text-white
                text-[12px]
                font-semibold
                transition
              "
            >
              Đăng ký
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-[1110px] mx-auto px-5">

        {/* TITLE */}
        <section className="pt-7">

          <h1 className="text-[21px] font-bold text-gray-900">
            Lịch sử ứng tuyển
          </h1>

          <p className="mt-1 text-[12px] text-gray-500">
            {applications.length} đơn ứng tuyển
          </p>

        </section>

        {/* ================= TABS ================= */}
        <div className="mt-6 border-b border-gray-200">

          <div className="flex items-center gap-7">

            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  relative
                  pb-3
                  text-[12px]
                  transition
                  ${
                    activeTab === tab
                      ? "text-blue-600 font-medium"
                      : "text-gray-600 hover:text-blue-600"
                  }
                `}
              >
                {tab}

                {activeTab === tab && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[1px] bg-blue-600" />
                )}
              </button>
            ))}

          </div>
        </div>

        {/* ================= TABLE ================= */}
        <section className="mt-5 mb-10">

          <div className="overflow-hidden rounded-[14px] border border-gray-200 bg-white">

            {/* TABLE HEADER */}
            <div
              className="
                grid
                grid-cols-[2.1fr_1.2fr_1fr_1fr_1.35fr]
                min-h-[38px]
                items-center
                bg-[#f8fafc]
                border-b
                border-gray-200
                px-4
              "
            >

              <div className="text-[10px] font-semibold text-gray-500 uppercase">
                Công việc
              </div>

              <div className="text-[10px] font-semibold text-gray-500 uppercase">
                Công ty
              </div>

              <div className="text-[10px] font-semibold text-gray-500 uppercase">
                Ngày ứng tuyển
              </div>

              <div className="text-[10px] font-semibold text-gray-500 uppercase">
                Trạng thái
              </div>

              <div></div>

            </div>

            {/* TABLE BODY */}
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className="
                    grid
                    grid-cols-[2.1fr_1.2fr_1fr_1fr_1.35fr]
                    min-h-[47px]
                    items-center
                    px-4
                    border-b
                    border-gray-100
                    last:border-b-0
                    hover:bg-gray-50
                    transition
                  "
                >

                  {/* JOB */}
                  <div>
                    <p className="text-[12px] font-semibold text-gray-900">
                      {application.job}
                    </p>
                  </div>

                  {/* COMPANY */}
                  <div>
                    <p className="text-[12px] text-gray-600">
                      {application.company}
                    </p>
                  </div>

                  {/* DATE */}
                  <div>
                    <p className="text-[12px] text-gray-500">
                      {application.date}
                    </p>
                  </div>

                  {/* STATUS */}
                  <div>
                    <span
                      className={`
                        inline-flex
                        items-center
                        px-2
                        py-[3px]
                        rounded-full
                        text-[10px]
                        font-medium
                        ${getStatusClass(application.statusType)}
                      `}
                    >
                      {application.status}
                    </span>
                  </div>

                  {/* ACTION */}
                  <div className="flex items-center gap-2 justify-end">

                    <button
                      className="
                        text-[10px]
                        text-blue-600
                        hover:text-blue-700
                        font-medium
                      "
                    >
                      Xem tin
                    </button>

                    <button
                      className="
                        text-[10px]
                        text-gray-500
                        hover:text-red-500
                      "
                    >
                      Rút hồ sơ
                    </button>

                  </div>

                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm text-gray-400">
                  Không có đơn ứng tuyển nào.
                </p>
              </div>
            )}

          </div>
        </section>

      </main>
    </div>
  );
}

export default ApplyPage;
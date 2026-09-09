function SavedJobsPage() {
  return <div>trang luu job yeu thich</div>;

  import { useState } from "react";
import {
  BriefcaseBusiness,
  Bell,
  MapPin,
  CircleDollarSign,
  Bookmark,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

function SavedJobsPage() {
  const [tab, setTab] = useState("Tất cả");

  const jobs = [
    {
      id: 1,
      logo: "VN",
      logoColor: "bg-violet-500",
      title: "React Frontend Developer",
      company: "VNG Corporation",
      location: "TP. Hồ Chí Minh",
      salary: "25 - 40 triệu",
      type: "Toàn thời gian",
      time: "5 giờ trước",
      source: "LinkedIn",
      status: "Đang tuyển",
    },
    {
      id: 2,
      logo: "SP",
      logoColor: "bg-orange-500",
      title: "UI/UX Designer",
      company: "Shopee Vietnam",
      location: "TP. Hồ Chí Minh",
      salary: "18 - 28 triệu",
      type: "Toàn thời gian",
      time: "3 ngày trước",
      source: "Facebook",
      status: "Đang tuyển",
    },
  ];

  const tabs = ["Tất cả", "Đang tuyển", "Đã đóng"];

  const filteredJobs =
    tab === "Tất cả"
      ? jobs
      : jobs.filter((job) => job.status === tab);

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* HEADER */}
      <header className="h-[56px] bg-white border-b border-gray-200">
        <div className="max-w-[1300px] mx-auto h-full px-8 flex items-center">

          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
              <BriefcaseBusiness
                size={20}
                className="text-white"
              />
            </div>

            <span className="text-[17px] font-bold text-gray-900">
              JobFinder
            </span>
          </div>

          {/* MENU */}
          <div className="ml-10 flex items-center gap-1 h-full">

            <button className="px-4 py-2 rounded-full text-sm text-gray-700 hover:bg-gray-50">
              Trang chủ
            </button>

            <button className="px-4 py-2 rounded-full text-sm text-gray-700 hover:bg-gray-50">
              Việc làm
            </button>

            <button className="px-4 py-2 rounded-full text-sm text-gray-700 hover:bg-gray-50">
              Đề xuất
            </button>

            <button className="px-4 py-2 rounded-full text-sm bg-blue-50 text-blue-600 font-medium">
              Yêu thích
            </button>

            <button className="px-4 py-2 rounded-full text-sm text-gray-700 hover:bg-gray-50">
              Ứng tuyển
            </button>

          </div>

          {/* USER */}
          <div className="ml-auto flex items-center gap-5">

            {/* NOTIFICATION */}
            <div className="relative">
              <Bell size={20} className="text-gray-600" />

              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>

            {/* ACCOUNT */}
            <div className="flex items-center gap-2">

              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  TT
                </span>
              </div>

              <div>
                <p className="text-[13px] text-gray-800 font-medium">
                  Trần Thị Bảo
                </p>

                <p className="text-[11px] text-gray-500 flex items-center gap-1">
                  <span>🌐</span>
                  Google
                </p>
              </div>

              <ChevronDown
                size={14}
                className="text-gray-500"
              />

            </div>

          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-[965px] mx-auto pt-8">

        {/* TITLE */}
        <div>
          <h1 className="text-[25px] font-bold text-gray-950">
            Việc làm yêu thích
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {jobs.length} việc làm đã lưu
          </p>
        </div>

        {/* TABS */}
        <div className="mt-10 border-b border-gray-200">

          <div className="flex">

            {tabs.map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`
                  relative px-4 h-[55px] text-sm
                  ${
                    tab === item
                      ? "text-blue-600 font-medium"
                      : "text-gray-500"
                  }
                `}
              >

                {item}

                {tab === item && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-blue-600"></span>
                )}

              </button>
            ))}

          </div>

        </div>

        {/* JOB CARDS */}
        <div className="grid grid-cols-2 gap-4 mt-6">

          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="
                bg-white
                border border-gray-200
                rounded-[22px]
                px-5
                pt-5
                pb-4
                shadow-sm
                hover:shadow-md
                transition
              "
            >

              {/* TOP */}
              <div className="flex items-start">

                {/* LOGO */}
                <div
                  className={`
                    w-11 h-11
                    rounded-[14px]
                    ${job.logoColor}
                    flex items-center justify-center
                    text-white
                    text-sm
                    font-bold
                    shrink-0
                  `}
                >
                  {job.logo}
                </div>

                {/* JOB NAME */}
                <div className="ml-3 flex-1 min-w-0">

                  <div className="flex items-center gap-1">

                    <h2 className="text-[15px] font-semibold text-blue-900 truncate">
                      {job.title}
                    </h2>

                    <CheckCircle2
                      size={14}
                      className="text-blue-500 fill-blue-500 text-white shrink-0"
                    />

                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    {job.company}
                  </p>

                </div>

                {/* FAVORITE */}
                <button
                  className="ml-2"
                  onClick={() => alert("Đã bỏ khỏi yêu thích")}
                >
                  <Bookmark
                    size={18}
                    className="text-blue-600"
                    fill="currentColor"
                  />
                </button>

              </div>

              {/* INFORMATION */}
              <div className="flex items-center gap-3 mt-4 text-xs text-gray-500">

                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{job.location}</span>
                </div>

                <div className="flex items-center gap-1">
                  <CircleDollarSign size={14} />
                  <span>{job.salary}</span>
                </div>

                <span className="px-2.5 py-1 bg-gray-100 rounded-full text-[11px] text-gray-600">
                  {job.type}
                </span>

              </div>

              {/* LINE */}
              <div className="border-t border-gray-100 mt-3 mb-3"></div>

              {/* BOTTOM */}
              <div className="flex items-center justify-between">

                <p className="text-xs text-gray-400">
                  {job.time}
                  <span className="mx-1">•</span>
                  <span className="text-blue-400">
                    {job.source}
                  </span>
                </p>

                <button
                  onClick={() => alert(`Ứng tuyển: ${job.title}`)}
                  className="
                    px-4
                    py-2
                    rounded-full
                    border border-gray-300
                    text-[13px]
                    text-blue-900
                    hover:bg-blue-50
                    hover:border-blue-500
                    transition
                  "
                >
                  Ứng tuyển
                </button>

              </div>

            </div>
          ))}

        </div>

      </main>
    </div>
  );
}

export default SavedJobsPage;
}

export default SavedJobsPage;

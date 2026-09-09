import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const jobs = [
    {
      company: "FPT Software",
      title: "Java Backend Developer",
      logo: "FP",
      logoColor: "bg-orange-500",
      location: "Hà Nội",
      salary: "20 - 35 triệu",
      type: "Toàn thời gian",
      time: "2 giờ trước",
      source: "Topcv",
      match: 92,
      featured: true,
    },
    {
      company: "VNG Corporation",
      title: "React Frontend Developer",
      logo: "VN",
      logoColor: "bg-purple-500",
      location: "TP. Hồ Chí Minh",
      salary: "25 - 40 triệu",
      type: "Toàn thời gian",
      time: "5 giờ trước",
      source: "LinkedIn",
      match: 88,
      featured: false,
    },
    {
      company: "Tiki",
      title: "Product Manager",
      logo: "TK",
      logoColor: "bg-red-500",
      location: "TP. Hồ Chí Minh",
      salary: "40 - 60 triệu",
      type: "Toàn thời gian",
      time: "1 ngày trước",
      source: "Topcv",
      match: 75,
      featured: true,
    },
  ];

  const categories = [
    {
      icon: "💻",
      title: "Công nghệ thông tin",
      jobs: "4.820 việc",
    },
    {
      icon: "📢",
      title: "Marketing & Truyền thông",
      jobs: "1.280 việc",
    },
    {
      icon: "🎨",
      title: "Thiết kế & Sáng tạo",
      jobs: "890 việc",
    },
    {
      icon: "💰",
      title: "Tài chính & Kế toán",
      jobs: "980 việc",
    },
    {
      icon: "📈",
      title: "Kinh doanh & Bán hàng",
      jobs: "1.560 việc",
    },
    {
      icon: "👥",
      title: "Nhân sự & Đào tạo",
      jobs: "640 việc",
    },
  ];

  const quickSearches = [
    "IT",
    "Marketing",
    "Thiết kế",
    "Tài chính",
    "Kinh doanh",
    "Remote",
    "Thực tập",
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">

        <div className="max-w-[1400px] mx-auto px-5 lg:px-8">

          <div className="h-[72px] flex items-center justify-between">

            {/* LOGO */}
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <span className="text-xl font-bold tracking-tight">
                JobCrawler
              </span>
            </div>

            {/* MENU */}
            <nav className="hidden lg:flex items-center gap-1 ml-8 mr-auto">

              <button
                className="px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium"
              >
                Trang chủ
              </button>

              <button className="px-4 py-2 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition">
                Việc làm
              </button>

              <button className="px-4 py-2 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition">
                Đề xuất
              </button>

              <button className="px-4 py-2 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition">
                Yêu thích
              </button>

              <button className="px-4 py-2 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition">
                Ứng tuyển
              </button>

            </nav>

            {/* RIGHT */}
            <div className="flex items-center gap-3">

              <button
                onClick={() => navigate("/login")}
                className="hidden sm:block text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Đăng nhập
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition shadow-sm"
              >
                Đăng ký
              </button>

            </div>

          </div>

        </div>
      </header>


      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600">

        <div className="max-w-[1400px] mx-auto px-5 lg:px-8">

          <div className="min-h-[315px] flex flex-col items-center justify-center text-center">

            {/* TITLE */}
            <h1 className="text-3xl sm:text-4xl lg:text-[38px] font-bold text-white tracking-tight">
              Tìm công việc phù hợp với bạn
            </h1>

            {/* SUBTITLE */}
            <p className="mt-3 text-blue-100 text-sm sm:text-base">
              Khám phá hàng nghìn cơ hội việc làm từ nhiều nguồn tuyển dụng.
            </p>


            {/* SEARCH BOX */}
            <div className="mt-8 w-full max-w-[610px]">

              <div className="bg-white rounded-2xl p-1.5 shadow-xl flex flex-col sm:flex-row">

                {/* JOB */}
                <div className="flex-1 flex items-center px-4 h-11">

                  <svg
                    className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                    />
                  </svg>

                  <input
                    type="text"
                    placeholder="Tên công việc, kỹ năng hoặc từ khóa"
                    className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
                  />

                </div>


                {/* LOCATION */}
                <div className="hidden sm:block w-px bg-gray-200 my-2" />

                <div className="flex-1 flex items-center px-4 h-11">

                  <svg
                    className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 21a2 2 0 01-2.828 0l-4.243-4.343a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>

                  <input
                    type="text"
                    placeholder="Địa điểm"
                    className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
                  />

                </div>


                {/* SEARCH BUTTON */}
                <button
                  className="
                    h-11
                    px-7
                    rounded-xl
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    text-sm
                    font-semibold
                    transition
                  "
                >
                  Tìm việc
                </button>

              </div>

            </div>


            {/* QUICK SEARCH */}
            <div className="mt-4 flex flex-wrap justify-center items-center gap-2">

              <span className="text-xs text-blue-100 font-medium mr-1">
                Tìm nhanh:
              </span>

              {quickSearches.map((item) => (
                <button
                  key={item}
                  className="
                    px-3
                    py-1
                    rounded-full
                    bg-white/15
                    hover:bg-white/25
                    text-white
                    text-[11px]
                    font-medium
                    transition
                  "
                >
                  {item}
                </button>
              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main className="max-w-[1400px] mx-auto px-5 lg:px-8">


        {/* =================================================
            JOBS
        ================================================== */}
        <section className="py-10">

          {/* TITLE */}
          <div className="flex items-center justify-between mb-5">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Việc làm phù hợp với bạn
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Dựa trên kỹ năng và kinh nghiệm của bạn
              </p>
            </div>

            <button className="hidden sm:flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
              Xem tất cả
              <span>›</span>
            </button>

          </div>


          {/* JOB GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

            {jobs.map((job) => (
              <div
                key={job.title}
                className="
                  bg-white
                  border
                  border-blue-100
                  rounded-2xl
                  p-4
                  hover:shadow-lg
                  hover:-translate-y-0.5
                  transition-all
                  duration-200
                "
              >

                {/* FEATURED */}
                {job.featured && (
                  <div className="text-[11px] text-blue-600 font-medium mb-2">
                    ★ Việc làm nổi bật
                  </div>
                )}

                {/* JOB HEADER */}
                <div className="flex items-start gap-3">

                  {/* LOGO */}
                  <div
                    className={`
                      ${job.logoColor}
                      w-9
                      h-9
                      rounded-xl
                      flex
                      items-center
                      justify-center
                      text-white
                      text-xs
                      font-bold
                      flex-shrink-0
                    `}
                  >
                    {job.logo}
                  </div>


                  {/* INFO */}
                  <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-1">

                      <h3 className="font-semibold text-sm text-gray-900 truncate">
                        {job.title}
                      </h3>

                      <span className="text-blue-500 text-xs">
                        ●
                      </span>

                    </div>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {job.company}
                    </p>

                  </div>


                  {/* BOOKMARK */}
                  <button className="text-gray-300 hover:text-blue-600 transition">

                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeWidth="1.7"
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z"
                      />
                    </svg>

                  </button>

                </div>


                {/* JOB META */}
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-gray-500">

                  <span className="flex items-center gap-1">
                    <span>⌖</span>
                    {job.location}
                  </span>

                  <span className="flex items-center gap-1">
                    <span>◷</span>
                    {job.salary}
                  </span>

                  <span className="px-2 py-1 bg-gray-50 rounded-full text-gray-600">
                    {job.type}
                  </span>

                </div>


                {/* MATCH */}
                <div className="mt-4 border-t border-gray-100 pt-3">

                  <div className="flex justify-between text-[11px] mb-1.5">

                    <span className="text-gray-600">
                      Độ phù hợp
                    </span>

                    <span className="font-semibold text-green-600">
                      {job.match}%
                    </span>

                  </div>

                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${job.match}%`,
                      }}
                    />

                  </div>

                </div>


                {/* FOOTER */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">

                  <span className="text-[11px] text-gray-400">
                    {job.time} · {job.source}
                  </span>

                  <button
                    className="
                      px-4
                      py-1.5
                      rounded-full
                      border
                      border-gray-200
                      hover:border-blue-500
                      hover:text-blue-600
                      text-xs
                      font-medium
                      text-gray-700
                      transition
                    "
                  >
                    Ứng tuyển
                  </button>

                </div>

              </div>
            ))}

          </div>

        </section>


        {/* =================================================
            CATEGORIES
        ================================================== */}
        <section className="pb-12">

          <div className="flex items-center justify-between mb-5">

            <h2 className="text-xl font-bold text-gray-900">
              Ngành nghề phổ biến
            </h2>

          </div>


          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">

            {categories.map((category) => (
              <button
                key={category.title}
                className="
                  min-h-[115px]
                  bg-white
                  border
                  border-gray-200
                  hover:border-blue-300
                  hover:shadow-md
                  rounded-2xl
                  px-3
                  py-5
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                  transition
                "
              >

                <div className="text-2xl mb-3">
                  {category.icon}
                </div>

                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">
                  {category.title}
                </h3>

                <p className="mt-1 text-[11px] text-gray-400">
                  {category.jobs}
                </p>

              </button>
            ))}

          </div>

        </section>

      </main>


      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="bg-blue-600">

        <div className="max-w-[1400px] mx-auto px-5 lg:px-8">

          <div className="py-12 sm:py-14 text-center">

            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Chưa có tài khoản?
            </h2>

            <p className="mt-2 text-sm text-blue-100">
              Đăng ký để nhận gợi ý việc làm cá nhân hóa và theo dõi ứng tuyển.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">

              <button
                onClick={() => navigate("/register")}
                className="
                  px-7
                  py-2.5
                  rounded-full
                  bg-white
                  text-blue-600
                  hover:bg-blue-50
                  text-sm
                  font-semibold
                  transition
                "
              >
                Đăng ký miễn phí
              </button>

              <button
                onClick={() => navigate("/login")}
                className="
                  px-7
                  py-2.5
                  rounded-full
                  border
                  border-white/40
                  text-white
                  hover:bg-white/10
                  text-sm
                  font-semibold
                  transition
                "
              >
                Đăng nhập
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="bg-white border-t border-gray-100">

        <div className="max-w-[1400px] mx-auto px-5 lg:px-8">

          <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3">

            <div className="flex items-center gap-2">

              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">

                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>

              </div>

            </div>

            <p className="text-xs text-gray-400">
              © 2026 JobFinder. All rights reserved.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default HomePage;
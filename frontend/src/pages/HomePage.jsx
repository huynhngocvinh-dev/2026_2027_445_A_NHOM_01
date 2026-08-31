// Vuong Lam

function HomePage() {
  const categories = [
    {
      icon: "💻",
      name: "IT / Phần mềm",
      jobs: "1,200+ việc làm",
    },
    {
      icon: "📣",
      name: "Marketing",
      jobs: "850+ việc làm",
    },
    {
      icon: "💼",
      name: "Sales",
      jobs: "920+ việc làm",
    },
    {
      icon: "🎨",
      name: "Thiết kế",
      jobs: "450+ việc làm",
    },
  ];

  const jobs = [
    {
      logo: "📄",
      title: "Senior Frontend Developer (React, TypeScript)",
      company: "TechNova Solutions",
      location: "Hồ Chí Minh",
      type: "Full-time",
      experience: "3+ năm",
      salary: "2,000 - 3,500 USD",
    },
    {
      logo: "🖼️",
      title: "Digital Marketing Manager",
      company: "Creative Spark Agency",
      location: "Hà Nội",
      type: "Full-time",
      experience: "5+ năm",
      salary: "Thỏa thuận",
    },
    {
      logo: "📊",
      title: "Chuyên viên Phân tích Dữ liệu (Data Analyst)",
      company: "FinTech Global",
      location: "Đà Nẵng",
      type: "Remote",
      experience: "1-3 năm",
      salary: "1,000 - 1,800 USD",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#17233c]">
      
      {/* ================= HEADER ================= */}
      <header className="flex h-[62px] items-center border-b border-[#e1e6ef] bg-white px-7">
        
        {/* Logo */}
        <div className="mr-[35px] text-[19px] font-bold text-[#063b91]">
          JobFinder
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-7">
          <a
            href="#"
            className="border-b-2 border-[#0645a5] pb-5 pt-[22px] text-[13px] font-semibold text-[#0645a5]"
          >
            Tìm kiếm
          </a>

          <a
            href="#"
            className="text-[13px] text-[#667085] transition hover:text-[#0645a5]"
          >
            Việc làm của tôi
          </a>

          <a
            href="#"
            className="text-[13px] text-[#667085] transition hover:text-[#0645a5]"
          >
            Đề xuất
          </a>
        </nav>

        {/* Header right */}
        <div className="ml-auto flex items-center gap-[14px]">
          <button className="cursor-pointer border-none bg-transparent text-[17px] text-[#667085]">
            ♧
          </button>

          <button className="cursor-pointer border-none bg-transparent text-[17px] text-[#667085]">
            ♡
          </button>

          <button className="cursor-pointer rounded-[7px] border-none bg-[#063b91] px-4 py-2 text-xs font-semibold text-white hover:bg-[#052f75]">
            Đăng tin
          </button>

          <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#f1f4f8] text-sm">
            👤
          </div>
        </div>
      </header>


      {/* ================= HERO ================= */}
      <section className="bg-[#f2f6ff] px-5 pb-[38px] pt-[52px] text-center">
        
        <h1 className="m-0 text-[30px] font-bold text-[#063b91]">
          Tìm công việc phù hợp với bạn
        </h1>

        <p className="my-[10px] mb-6 text-[13px] leading-[1.6] text-[#68758b]">
          Khám phá hàng ngàn cơ hội việc làm mới mỗi ngày.
          <br />
          Nâng tầm sự nghiệp của bạn cùng JobFinder.
        </p>

        {/* Search */}
        <div className="mx-auto flex w-[min(700px,90%)] items-center rounded-lg bg-white p-[5px] shadow-[0_5px_15px_rgba(25,50,90,0.08)]">
          
          <div className="flex h-[42px] flex-1 items-center gap-2 border-r border-[#edf0f5] px-3">
            <span className="text-base text-[#8290a8]">⌕</span>

            <input
              type="text"
              placeholder="Chức danh, từ khóa..."
              className="w-full border-none bg-transparent text-xs text-[#333] outline-none placeholder:text-[#a9b2c2]"
            />
          </div>

          <div className="flex h-[42px] flex-1 items-center gap-2 px-3">
            <span className="text-base text-[#8290a8]">⌖</span>

            <input
              type="text"
              placeholder="Địa điểm..."
              className="w-full border-none bg-transparent text-xs text-[#333] outline-none placeholder:text-[#a9b2c2]"
            />
          </div>

          <button className="h-10 rounded-md border-none bg-[#063b91] px-[22px] text-xs font-semibold text-white transition hover:bg-[#052f75]">
            Tìm kiếm
          </button>
        </div>

        {/* Filters */}
        <div className="mt-[13px] flex justify-center gap-2">
          {["Full-time", "Remote", "Thực tập", "Mức lương"].map(
            (filter) => (
              <button
                key={filter}
                className="cursor-pointer rounded-[15px] border border-[#dce3ef] bg-white px-3 py-[5px] text-[10px] text-[#344054] hover:border-[#0645a5] hover:text-[#0645a5]"
              >
                {filter}
              </button>
            )
          )}
        </div>
      </section>


      {/* ================= CATEGORY ================= */}
      <section className="px-[25px] pb-8 pt-[35px]">
        
        <h2 className="m-0 text-xl font-bold text-[#17233c]">
          Ngành nghề phổ biến
        </h2>

        <div className="mt-[14px] grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex min-h-[115px] cursor-pointer flex-col items-center justify-center rounded-[7px] border border-[#e0e6f0] bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#b8c9e8] hover:shadow-[0_5px_15px_rgba(20,60,120,0.07)]"
            >
              <div className="mb-2 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#eaf1ff] text-base">
                {category.icon}
              </div>

              <h3 className="m-0 text-xs text-[#16233e]">
                {category.name}
              </h3>

              <p className="mt-[5px] text-[9px] text-[#8a95a8]">
                {category.jobs}
              </p>
            </div>
          ))}
        </div>
      </section>


      {/* ================= JOB SECTION ================= */}
      <section className="bg-[#f2f6ff] px-[25px] pb-[38px] pt-8">
        
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="m-0 text-xl font-bold text-[#17233c]">
              Việc làm mới nhất
            </h2>

            <p className="mt-[6px] text-[10px] text-[#7b879b]">
              Cơ hội hấp dẫn vừa được cập nhật.
            </p>
          </div>

          <a
            href="#"
            className="text-[10px] text-[#0750a7] no-underline hover:underline"
          >
            Xem tất cả
          </a>
        </div>


        {/* Job list */}
        <div className="mt-[14px] grid grid-cols-1 gap-[14px] md:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job.title}
              className="flex min-h-[245px] flex-col rounded-[7px] border border-[#dbe2ed] bg-white p-3 shadow-[0_2px_5px_rgba(30,50,90,0.03)]"
            >
              
              {/* Top */}
              <div className="flex items-start justify-between">
                
                <div className="flex h-[38px] w-10 items-center justify-center rounded-[5px] border border-[#e1e7f0] bg-[#f4f7fc] text-[17px]">
                  {job.logo}
                </div>

                <button className="cursor-pointer border-none bg-transparent text-lg text-[#69778e]">
                  ♡
                </button>
              </div>


              {/* Job title */}
              <h3 className="my-[10px] mb-[5px] text-[13px] font-semibold leading-[1.4] text-[#16233e]">
                {job.title}
              </h3>

              {/* Company */}
              <p className="m-0 text-[10px] text-[#6d788c]">
                {job.company}
              </p>


              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-[5px]">
                
                <span className="rounded border border-[#dce7f8] bg-[#f1f6ff] px-[6px] py-1 text-[8px] text-[#49658d]">
                  📍 {job.location}
                </span>

                <span className="rounded border border-[#dce7f8] bg-[#f1f6ff] px-[6px] py-1 text-[8px] text-[#49658d]">
                  💼 {job.type}
                </span>

                <span className="rounded border border-[#dce7f8] bg-[#f1f6ff] px-[6px] py-1 text-[8px] text-[#49658d]">
                  ◷ {job.experience}
                </span>
              </div>


              {/* Bottom */}
              <div className="mt-auto flex items-center justify-between pt-[18px]">
                
                <strong className="text-[13px] text-[#063b91]">
                  {job.salary}
                </strong>

                <button className="cursor-pointer rounded-[5px] border-none bg-[#0066cc] px-[13px] py-[7px] text-[9px] font-semibold text-white hover:bg-[#0053a6]">
                  Ứng tuyển
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default HomePage;
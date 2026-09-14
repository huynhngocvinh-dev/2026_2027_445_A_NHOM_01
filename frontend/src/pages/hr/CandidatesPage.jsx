// Ứng Viên
import { useState } from "react";

function CandidatesPage() {
  const [search, setSearch] = useState("");

  const [candidates] = useState([
    {
      id: 1,
      name: "Nguyễn Văn An",
      position: "Backend Developer",
      experience: "3 năm",
      skills: ["Java", "Spring Boot", "MySQL", "Docker"],
      job: "Java Backend Developer",
      date: "15/01/2024",
      status: "Đang tuyển",
      review: "Đang xem xét",
      avatar: "NA",
    },
    {
      id: 2,
      name: "Trần Thị Bảo",
      position: "Frontend Developer",
      experience: "2 năm",
      skills: ["React", "TypeScript", "CSS", "Vue.js"],
      job: "Java Backend Developer",
      date: "20/01/2024",
      status: "Đang tuyển",
      review: "Đang xem xét",
      avatar: "TB",
    },
    {
      id: 3,
      name: "Phạm Minh Cường",
      position: "Data Analyst",
      experience: "4 năm",
      skills: ["SQL", "Python", "Tableau", "Excel"],
      job: "Java Backend Developer",
      date: "08/02/2024",
      status: "Không hoạt động",
      review: "Đang xem xét",
      avatar: "PC",
    },
    {
      id: 4,
      name: "Lê Thị Dung",
      position: "UI/UX Designer",
      experience: "3 năm",
      skills: ["Figma", "Adobe XD", "Sketch", "Illustrator"],
      job: "Java Backend Developer",
      date: "12/02/2024",
      status: "Đang tuyển",
      review: "Đang xem xét",
      avatar: "LD",
    },
    {
      id: 5,
      name: "Hoàng Văn Em",
      position: "DevOps Engineer",
      experience: "5 năm",
      skills: ["AWS", "Kubernetes", "Docker", "Terraform"],
      job: "Java Backend Developer",
      date: "25/02/2024",
      status: "Đang tuyển",
      review: "Đang xem xét",
      avatar: "HE",
    },
  ]);

  const filteredCandidates = candidates.filter((candidate) =>
    `${candidate.name} ${candidate.position}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-[calc(100vh-52px)] bg-slate-50 p-5">
      {/* TITLE */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-950">Ứng viên</h1>

        <p className="mt-1 text-sm text-slate-500">
          {candidates.length} ứng viên
        </p>
      </div>

      {/* FILTER */}
      <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            ⌕
          </span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm ứng viên..."
            className="h-9 w-full rounded-full border border-slate-300 pl-9 pr-3 text-xs outline-none focus:border-blue-500"
          />
        </div>

        <select className="h-9 rounded-full border border-slate-300 px-4 text-xs text-slate-600">
          <option>Tất cả vị trí</option>
          <option>Backend Developer</option>
          <option>Frontend Developer</option>
          <option>Data Analyst</option>
          <option>UI/UX Designer</option>
          <option>DevOps Engineer</option>
        </select>

        <select className="h-9 rounded-full border border-slate-300 px-4 text-xs text-slate-600">
          <option>Tất cả trạng thái</option>
          <option>Đang tuyển</option>
          <option>Không hoạt động</option>
        </select>

        <select className="h-9 rounded-full border border-slate-300 px-4 text-xs text-slate-600">
          <option>Kinh nghiệm</option>
          <option>Dưới 1 năm</option>
          <option>1 - 3 năm</option>
          <option>3 - 5 năm</option>
          <option>Trên 5 năm</option>
        </select>
      </div>

      {/* CANDIDATES */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            {/* HEADER */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                  {candidate.avatar}
                </div>

                <div>
                  <h2 className="text-sm font-bold">{candidate.name}</h2>

                  <p className="text-[11px] text-slate-500">
                    {candidate.position} · {candidate.experience}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-2 py-1 text-[10px] ${
                  candidate.status === "Đang tuyển"
                    ? "bg-green-50 text-green-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {candidate.status}
              </span>
            </div>

            {/* SKILLS */}
            <div className="mt-3 flex flex-wrap gap-1">
              {candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-600"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* APPLICATION */}
            <div className="mt-3 border-b border-slate-100 pb-3 text-[10px] text-slate-500">
              Ứng tuyển:
              <span className="font-medium text-slate-700">
                {" "}
                {candidate.job}
              </span>{" "}
              · {candidate.date}
            </div>

            {/* ACTIONS */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Xem hồ sơ: ${candidate.name}`)}
                  className="rounded-full bg-blue-600 px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-blue-700"
                >
                  Xem hồ sơ
                </button>

                <button
                  onClick={() => alert(`Gửi email cho ${candidate.name}`)}
                  className="rounded-full border border-slate-300 px-3 py-1.5 text-[10px] text-slate-600 hover:bg-slate-50"
                >
                  Gửi email
                </button>
              </div>

              <select
                defaultValue={candidate.review}
                className="rounded-full border border-slate-300 px-3 py-1.5 text-[10px] text-slate-600 outline-none"
              >
                <option>Đang xem xét</option>
                <option>Đạt</option>
                <option>Không đạt</option>
                <option>Đã phỏng vấn</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CandidatesPage;

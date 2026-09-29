import {
  FiMapPin,
  FiDollarSign,
  FiBriefcase,
  FiClock,
  FiX,
  FiShare2,
  FiLink,
} from "react-icons/fi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

function JobDetailModal({ job, onClose, saved = false, onToggleSave }) {
  if (!job) return null;

  const title = job.jobTitle || job.title || "Chưa có tiêu đề";
  const company = job.companyName || job.company || "Công ty chưa cập nhật";
  const location = job.location || "Toàn quốc";
  const type = job.jobType || job.type || "Toàn thời gian";
  const exp = job.experience ? `${job.experience} năm` : "Không yêu cầu";

  let salaryDisplay = job.salary;
  if (!salaryDisplay && (job.minSalary || job.maxSalary)) {
    if (job.minSalary && job.maxSalary)
      salaryDisplay = `${job.minSalary} - ${job.maxSalary} triệu`;
    else if (job.minSalary) salaryDisplay = `Từ ${job.minSalary} triệu`;
    else salaryDisplay = `Tới ${job.maxSalary} triệu`;
  }

  const logoText = company.slice(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#f8fafc] w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-y-auto relative flex flex-col">
        {/* Nút đóng Modal */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition shadow-sm"
        >
          <FiX size={20} />
        </button>

        <div className="p-6 md:p-8 space-y-6">
          {/* 1. HEADER CHÍNH */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-md">
                  {logoText}
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    {title}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-gray-700">
                      {company}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-semibold border border-blue-100">
                      ✓ Đã xác minh
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleSave?.(job)}
                  className="p-2.5 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition"
                >
                  {saved ? (
                    <BsBookmarkFill className="text-blue-600" size={18} />
                  ) : (
                    <BsBookmark size={18} />
                  )}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition"
                >
                  <FiShare2 size={14} /> Chia sẻ
                </button>
              </div>
            </div>

            {/* Thông số nhanh */}
            <div className="mt-5 pt-5 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs text-gray-600 font-medium">
              <span className="flex items-center gap-1.5">
                <FiMapPin size={15} className="text-gray-400" /> {location}
              </span>
              <span className="flex items-center gap-1.5">
                <FiDollarSign size={15} className="text-gray-400" />{" "}
                {salaryDisplay || "Thỏa thuận"}
              </span>
              <span className="flex items-center gap-1.5">
                <FiBriefcase size={15} className="text-gray-400" /> {exp}
              </span>
              <span className="flex items-center gap-1.5">
                <FiClock size={15} className="text-gray-400" /> Vừa xong
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 font-semibold">
                {type}
              </span>
            </div>

            {/* Nút hành động */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (job.originalLink) window.open(job.originalLink, "_blank");
                  else alert("Chức năng nộp CV đang được xử lý!");
                }}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 transition"
              >
                Ứng tuyển ngay
              </button>
              <button
                onClick={() => onToggleSave?.(job)}
                className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition"
              >
                {saved ? "Đã lưu việc làm" : "Lưu việc làm"}
              </button>
            </div>
          </div>

          {/* 2. MÔ TẢ CÔNG VIỆC */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-3">
              Mô tả công việc
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {job.description || "Chưa có thông tin mô tả chi tiết."}
            </p>
          </div>

          {/* 3. YÊU CẦU ỨNG VIÊN */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-3">
              Yêu cầu ứng viên
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {job.requirements || "Chưa cập nhật thông tin yêu cầu."}
            </p>
          </div>

          {/* 4. QUYỀN LỢI */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-3">
              Quyền lợi
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {job.benefits || "Chưa cập nhật quyền lợi."}
            </p>
          </div>

          {/* 5. KHÁM PHÁ KỸ NĂNG */}
          {job.category && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-3">
                Kỹ năng yêu cầu
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.category.split(",").map((skill, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-medium"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 6. THÔNG TIN CÔNG TY */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900">
              Thông tin công ty
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold shrink-0">
                {logoText}
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">{company}</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Công nghệ thông tin · 5000+ nhân viên · {location}
                </p>
              </div>
            </div>

            {job.originalLink && (
              <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                <FiLink size={14} /> Nguồn tuyển dụng:
                <a
                  href={job.originalLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline font-medium"
                >
                  {job.source || "Nguồn gốc tin cào"}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetailModal;

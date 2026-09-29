import { FiMapPin, FiDollarSign, FiBriefcase } from "react-icons/fi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

// Hàm hỗ trợ format thời gian từ ISO String (vd: "2026-09-13T14:10:06" -> "3 ngày trước")
function formatTimeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Vừa xong";
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ngày trước`;
}

function JobCard({ job, saved = false, onToggleSave, onApply, onClickCard }) {
  if (!job) return null;

  // MAP DỮ LIỆU TỪ BACKEND VÀ DUMMY DATA VỀ CHUẨN DÙNG TRONG CARD
  const title = job.jobTitle || job.title || "Chưa có tiêu đề";
  const company = job.companyName || job.company || "Công ty chưa cập nhật";
  const location = job.location || "Toàn quốc";
  const type = job.jobType || job.type || "Toàn thời gian";

  // Format Lương
  let salaryDisplay = job.salary;
  if (!salaryDisplay && (job.minSalary || job.maxSalary)) {
    if (job.minSalary && job.maxSalary) {
      salaryDisplay = `${job.minSalary} - ${job.maxSalary} triệu`;
    } else if (job.minSalary) {
      salaryDisplay = `Từ ${job.minSalary} triệu`;
    } else {
      salaryDisplay = `Tới ${job.maxSalary} triệu`;
    }
  }

  // Format Thời gian & Nguồn
  const postedAt = job.postedAt || formatTimeAgo(job.createdAt);
  const source = job.source || "System";

  // Tạo Logo đại diện từ 2 chữ cái đầu của tên Công ty
  const logoText = company.slice(0, 2).toUpperCase();

  const handleCardClick = () => {
    if (onClickCard) {
      onClickCard(job);
    } else if (onApply) {
      onApply(job);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-blue-100 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {job.featured && (
          <div className="text-[11px] text-blue-600 font-medium mb-2">
            ★ Việc làm nổi bật
          </div>
        )}

        <div className="flex items-start gap-3">
          <div
            className={`${
              job.logoColor || "bg-blue-600"
            } w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}
          >
            {job.logo ?? logoText}
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="font-semibold text-sm text-gray-900 truncate hover:text-blue-600 transition"
              title={title}
            >
              {title}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{company}</p>
          </div>

          <button
            type="button"
            aria-label={saved ? "Bỏ lưu tin" : "Lưu tin"}
            onClick={(e) => {
              e.stopPropagation(); // Ngăn kích hoạt click nguyên thẻ JobCard
              onToggleSave?.(job);
            }}
            className={`shrink-0 cursor-pointer border-none bg-transparent transition ${
              saved ? "text-blue-600" : "text-gray-300 hover:text-blue-600"
            }`}
          >
            {saved ? <BsBookmarkFill size={16} /> : <BsBookmark size={16} />}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-gray-500">
          {location && (
            <span className="flex items-center gap-1">
              <FiMapPin size={12} className="text-gray-400" />
              {location}
            </span>
          )}
          {salaryDisplay && (
            <span className="flex items-center gap-1 font-medium text-gray-700">
              <FiDollarSign size={12} className="text-gray-400" />
              {salaryDisplay}
            </span>
          )}
          {type && (
            <span className="px-2.5 py-0.5 bg-gray-100 rounded-full text-gray-600 flex items-center gap-1 font-medium capitalize">
              <FiBriefcase size={11} className="text-gray-400" />
              {type}
            </span>
          )}
        </div>

        {typeof job.match === "number" && (
          <div className="mt-4 border-t border-gray-100 pt-3">
            <div className="flex justify-between text-[11px] mb-1.5">
              <span className="text-gray-600">Độ phù hợp</span>
              <span className="font-semibold text-green-600">{job.match}%</span>
            </div>
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${job.match}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">
          {[postedAt, source].filter(Boolean).join(" · ")}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // Ngăn kích hoạt click trùng lặp
            if (onClickCard) {
              onClickCard(job);
            } else if (onApply) {
              onApply(job);
            }
          }}
          className="px-4 py-1.5 rounded-full border border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 text-xs font-medium text-gray-700 transition"
        >
          Ứng tuyển
        </button>
      </div>
    </div>
  );
}

export default JobCard;

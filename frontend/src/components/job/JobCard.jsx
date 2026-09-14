import { FiMapPin, FiDollarSign, FiBriefcase } from "react-icons/fi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

/**
 * Thẻ hiển thị 1 công việc - component tái sử dụng DUY NHẤT cho toàn app
 * (trước đây HomePage, JobListPage mỗi nơi tự vẽ lại UI này gây trùng lặp code).
 * Dùng ở HomePage (việc làm phù hợp), JobListPage (kết quả tìm kiếm),
 * SavedJobsPage (việc đã lưu)...
 *
 * props:
 * - job: { id, title, company, logo, logoColor, location, salary, type,
 *          match, featured, postedAt, source }
 * - saved: bool - job này đã được lưu chưa (đổi icon bookmark)
 * - onToggleSave: (job) => void
 * - onApply: (job) => void
 */
function JobCard({ job, saved = false, onToggleSave, onApply }) {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {job.featured && (
        <div className="text-[11px] text-blue-600 font-medium mb-2">★ Việc làm nổi bật</div>
      )}

      <div className="flex items-start gap-3">
        <div
          className={`${job.logoColor || "bg-blue-500"} w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
        >
          {job.logo ?? job.company?.slice(0, 2).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm text-gray-900 truncate">{job.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{job.company}</p>
        </div>

        <button
          type="button"
          aria-label={saved ? "Bỏ lưu tin" : "Lưu tin"}
          onClick={() => onToggleSave?.(job)}
          className={`shrink-0 cursor-pointer border-none bg-transparent transition ${saved ? "text-blue-600" : "text-gray-300 hover:text-blue-600"}`}
        >
          {saved ? <BsBookmarkFill size={16} /> : <BsBookmark size={16} />}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-gray-500">
        {job.location && (
          <span className="flex items-center gap-1">
            <FiMapPin size={12} />
            {job.location}
          </span>
        )}
        {job.salary && (
          <span className="flex items-center gap-1">
            <FiDollarSign size={12} />
            {job.salary}
          </span>
        )}
        {job.type && (
          <span className="px-2 py-1 bg-gray-50 rounded-full text-gray-600 flex items-center gap-1">
            <FiBriefcase size={11} />
            {job.type}
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
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${job.match}%` }} />
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">
          {[job.postedAt, job.source].filter(Boolean).join(" · ")}
        </span>

        <button
          type="button"
          onClick={() => onApply?.(job)}
          className="px-4 py-1.5 rounded-full border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-xs font-medium text-gray-700 transition"
        >
          Ứng tuyển
        </button>
      </div>
    </div>
  );
}

export default JobCard;

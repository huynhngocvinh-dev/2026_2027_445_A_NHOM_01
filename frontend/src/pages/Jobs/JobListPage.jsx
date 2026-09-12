import Badge from "../../components/Badge";

/**
 * Thẻ hiển thị 1 công việc. Dùng lại ở HomePage (việc làm mới nhất),
 * JobListPage (kết quả tìm kiếm), SavedJobsPage (việc đã lưu)...
 *
 * props:
 * - job: { id, logo, title, company, location, type, experience, salary }
 * - saved: bool - job này đã được lưu chưa (đổi icon trái tim)
 * - onToggleSave: (job) => void
 * - onApply: (job) => void
 */
function JobListPage({ job, saved = false, onToggleSave, onApply }) {
  return (
    <div className="flex min-h-[245px] flex-col rounded-[7px] border border-[#dbe2ed] bg-white p-3 shadow-[0_2px_5px_rgba(30,50,90,0.03)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(30,50,90,0.08)]">
      {/* Top */}
      <div className="flex items-start justify-between">
        <div className="flex h-[38px] w-10 items-center justify-center rounded-[5px] border border-[#e1e7f0] bg-[#f4f7fc] text-[17px]">
          {job.logo ?? "🏢"}
        </div>

        <button
          type="button"
          aria-label={saved ? "Bỏ lưu tin" : "Lưu tin"}
          onClick={() => onToggleSave?.(job)}
          className={`cursor-pointer border-none bg-transparent text-lg transition ${
            saved ? "text-[#e0245e]" : "text-[#69778e]"
          }`}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>

      {/* Title + company */}
      <h3 className="my-[10px] mb-[5px] line-clamp-2 text-[13px] font-semibold leading-[1.4] text-[#16233e]">
        {job.title}
      </h3>
      <p className="m-0 text-[10px] text-[#6d788c]">{job.company}</p>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-[5px]">
        {job.location && <Badge icon="📍">{job.location}</Badge>}
        {job.type && <Badge icon="💼">{job.type}</Badge>}
        {job.experience && <Badge icon="◷">{job.experience}</Badge>}
      </div>

      {/* Bottom */}
      <div className="mt-auto flex items-center justify-between pt-[18px]">
        <strong className="text-[13px] text-[#063b91]">{job.salary}</strong>

        <button
          type="button"
          onClick={() => onApply?.(job)}
          className="cursor-pointer rounded-[5px] border-none bg-[#0066cc] px-[13px] py-[7px] text-[9px] font-semibold text-white transition hover:bg-[#0053a6]"
        >
          Ứng tuyển
        </button>
      </div>
    </div>
  );
}

export default JobListPage;

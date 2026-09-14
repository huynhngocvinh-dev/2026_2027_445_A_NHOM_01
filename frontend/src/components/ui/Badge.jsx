/**
 * Thẻ nhãn nhỏ dùng cho JobCard (địa điểm, hình thức làm việc, kinh nghiệm...)
 * Ví dụ: <Badge icon={<FiMapPin />}>{job.location}</Badge>
 */
function Badge({ icon, children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border border-[#dce7f8] bg-[#f1f6ff] px-[6px] py-1 text-[10px] text-[#49658d] ${className}`}
    >
      {icon && (
        <span aria-hidden className="flex items-center">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}

export default Badge;

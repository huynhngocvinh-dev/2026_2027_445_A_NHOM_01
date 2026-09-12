/**
 * Nút chỉ chứa icon (chuông, tim, avatar placeholder...). Dùng ở Header, JobCard.
 */
function IconButton({ children, label, className = "", ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-[17px] text-[#667085] transition hover:bg-[#f1f4f8] ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default IconButton;

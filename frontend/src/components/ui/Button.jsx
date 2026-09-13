const VARIANTS = {
  primary: "bg-[#063b91] text-white hover:bg-[#052f75] border-none",
  secondary: "bg-white text-[#0645a5] border border-[#dce3ef] hover:border-[#0645a5]",
  outline: "bg-transparent text-[#344054] border border-[#dce3ef] hover:border-[#0645a5] hover:text-[#0645a5]",
  ghost: "bg-transparent text-[#667085] border-none hover:text-[#0645a5]",
};

const SIZES = {
  sm: "px-3 py-[6px] text-[11px]",
  md: "px-4 py-2 text-xs",
  lg: "px-5 py-[10px] text-sm",
};

/**
 * Nút dùng chung cho toàn app (Header, form, JobCard...).
 * Ví dụ: <Button variant="primary" size="md">Đăng nhập</Button>
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled = false,
  type = "button",
  className = "",
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-[7px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {isLoading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

export default Button;

function Badge({ icon, children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border border-[#dce7f8] bg-[#f1f6ff] px-[6px] py-1 text-[8px] text-[#49658d] ${className}`}
    >
      {icon && <span aria-hidden>{icon}</span>}
      {children}
    </span>
  );
}

export default Badge;

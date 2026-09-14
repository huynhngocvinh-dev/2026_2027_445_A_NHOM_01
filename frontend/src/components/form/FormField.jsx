/**
 * Input dùng chung cho các form (đăng nhập, đăng ký, hồ sơ, đăng tin...).
 * Giữ nguyên 2 kiểu giao diện đã có sẵn trong app:
 * - size="md" (mặc định): input cao 44px, có icon bên trái - dùng ở LoginPage
 * - size="sm": input cao 40px, gọn hơn, không icon - dùng ở RegisterPage/CreateJobPage
 *
 * Ví dụ: <FormField label="Email" icon={<FiMail />} error={errors.email} name="email"
 *          type="email" value={formData.email} onChange={handleChange} />
 */
function FormField({
  label,
  icon,
  error,
  className = "",
  labelClassName = "",
  size = "md",
  rightElement,
  ...inputProps
}) {
  const isMd = size === "md";

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputProps.id || inputProps.name}
          className={
            labelClassName ||
            (isMd
              ? "block mb-2 text-sm font-medium text-gray-700"
              : "block text-xs font-medium text-gray-700 mb-1")
          }
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && isMd && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">{icon}</span>
        )}

        <input
          id={inputProps.id || inputProps.name}
          {...inputProps}
          className={`w-full outline-none transition border bg-white ${
            isMd ? `h-11 rounded-lg text-sm ${icon ? "pl-11" : "px-4"} ${rightElement ? "pr-16" : "pr-4"}` : "h-10 px-3.5 rounded-lg text-sm"
          } ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          }`}
        />

        {rightElement}
      </div>

      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

export default FormField;

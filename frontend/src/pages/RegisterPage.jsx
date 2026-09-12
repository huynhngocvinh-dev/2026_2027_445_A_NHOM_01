import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authApi } from "../components/auth/Authapi";
import { ApiError } from "../components/auth/Apiclient";
import { ROLES } from "../components/auth/roles";

// UI dùng "job_seeker"/"employer" cho dễ đọc, backend cần đúng giá trị role thật
const ROLE_MAP = {
  job_seeker: ROLES.CANDIDATE,
  employer: ROLES.EMPLOYER,
};

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "job_seeker",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Sau khi đăng ký thành công, backend gửi OTP qua email và chờ xác thực
  // trước khi tài khoản dùng được -> chuyển UI sang bước nhập OTP.
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // VALIDATE
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Họ và tên phải có ít nhất 2 ký tự";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^(0|\+84)[0-9]{9,10}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!formData.agree) {
      newErrors.agree = "Bạn cần đồng ý với điều khoản sử dụng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      role: ROLE_MAP[formData.role] ?? ROLES.CANDIDATE,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phone.trim(),
      password: formData.password,
    };

    try {
      setLoading(true);
      await authApi.register(payload);

      toast.success(
        "Đăng ký thành công! Vui lòng nhập mã OTP đã gửi tới email của bạn."
      );
      setStep("otp");
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        // Map lỗi validate từ backend (phoneNumber) về đúng field trên form (phone)
        const { phoneNumber, ...rest } = error.fieldErrors;
        setErrors((prev) => ({
          ...prev,
          ...rest,
          ...(phoneNumber ? { phone: phoneNumber } : {}),
        }));
      }
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Không thể kết nối đến server"
      );
    } finally {
      setLoading(false);
    }
  };

  // HANDLE VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setOtpError("Vui lòng nhập mã OTP");
      return;
    }

    try {
      setIsVerifying(true);
      setOtpError("");
      await authApi.verifyOtp({
        email: formData.email.trim(),
        otpCode: otpCode.trim(),
      });

      toast.success("Xác thực tài khoản thành công! Mời bạn đăng nhập.");
      navigate("/login");
    } catch (error) {
      setOtpError(
        error instanceof ApiError
          ? error.message
          : "Xác thực thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex">
      {/* ================= PHẦN BÊN TRÁI (LEFT SIDE) ================= */}
      <div className="hidden md:flex md:w-1/2 relative bg-[#1e40af] overflow-hidden">
        {/* Nền Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 opacity-90" />
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        {/* Nội dung bên trái */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12 lg:p-16 text-white">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">
              JobCrawler
            </span>
          </div>

          {/* Tiêu đề & Nội dung */}
          <div className="max-w-md my-auto py-10">
            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-white">
              Khám phá cơ hội <br />
              Nâng tầm sự nghiệp.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-blue-100/80">
              Nền tảng tuyển dụng thông minh kết nối nhân tài với những doanh
              nghiệp hàng đầu. Đăng ký ngay để bắt đầu hành trình mới.
            </p>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <img
                className="w-9 h-9 rounded-full border-2 border-blue-800 object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="User 1"
              />
              <img
                className="w-9 h-9 rounded-full border-2 border-blue-800 object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="User 2"
              />
              <img
                className="w-9 h-9 rounded-full border-2 border-blue-800 object-cover"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                alt="User 3"
              />
            </div>
            <span className="text-xs font-medium text-blue-100/90">
              Tham gia cùng{" "}
              <strong className="text-white font-semibold">+10,000</strong>{" "}
              chuyên gia
            </span>
          </div>
        </div>
      </div>

      {/* ================= PHẦN BÊN PHẢI (RIGHT SIDE) ================= */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              {step === "otp" ? "Xác thực email" : "Tạo tài khoản"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {step === "otp"
                ? `Nhập mã OTP vừa gửi tới ${formData.email}`
                : "Điền thông tin bên dưới để tham gia JobFinder."}
            </p>
          </div>

          {step === "otp" ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mã OTP
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value);
                    setOtpError("");
                  }}
                  placeholder="Nhập mã 6 số"
                  className={`w-full h-11 px-3.5 border rounded-lg text-sm tracking-[0.3em] text-center transition focus:outline-none focus:ring-2 ${
                    otpError
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
                  }`}
                />
                {otpError && (
                  <p className="mt-1 text-xs text-red-500 font-medium">
                    {otpError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full h-11 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-60"
              >
                {isVerifying ? "Đang xác thực..." : "Xác thực"}
              </button>

              <button
                type="button"
                onClick={() => setStep("form")}
                className="w-full h-11 rounded-lg border border-gray-300 bg-white text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                ← Quay lại sửa thông tin
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* ROLE SELECTOR */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Bạn là ai?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, role: "job_seeker" }))
                      }
                      className={`h-11 px-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                        formData.role === "job_seeker"
                          ? "border-blue-600 bg-blue-50/60 text-blue-700 ring-2 ring-blue-600/20"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Người tìm việc
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, role: "employer" }))
                      }
                      className={`h-11 px-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                        formData.role === "employer"
                          ? "border-blue-600 bg-blue-50/60 text-blue-700 ring-2 ring-blue-600/20"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m3 0h1m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-6 0h6"
                        />
                      </svg>
                      Nhà tuyển dụng
                    </button>
                  </div>
                </div>

                {/* FULL NAME */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    className={`w-full h-10 px-3.5 border rounded-lg text-sm transition focus:outline-none focus:ring-2 ${
                      errors.fullName
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* EMAIL & PHONE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className={`w-full h-10 px-3.5 border rounded-lg text-sm transition focus:outline-none focus:ring-2 ${
                        errors.email
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0901234567"
                      className={`w-full h-10 px-3.5 border rounded-lg text-sm transition focus:outline-none focus:ring-2 ${
                        errors.phone
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500 font-medium">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* PASSWORD & CONFIRM PASSWORD */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full h-10 px-3.5 pr-9 border rounded-lg text-sm transition focus:outline-none focus:ring-2 ${
                          errors.password
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {showPassword ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          )}
                        </svg>
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500 font-medium">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Xác nhận mật khẩu
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full h-10 px-3.5 border rounded-lg text-sm transition focus:outline-none focus:ring-2 ${
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500 font-medium">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* TERMS CHECKBOX */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agree"
                      checked={formData.agree}
                      onChange={handleChange}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600 leading-normal">
                      Tôi đồng ý với{" "}
                      <button
                        type="button"
                        className="text-blue-600 font-medium hover:underline"
                      >
                        điều khoản sử dụng
                      </button>{" "}
                      và{" "}
                      <button
                        type="button"
                        className="text-blue-600 font-medium hover:underline"
                      >
                        chính sách bảo mật
                      </button>
                    </span>
                  </label>
                  {errors.agree && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      {errors.agree}
                    </p>
                  )}
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
                >
                  {loading ? "Đang đăng ký..." : "Đăng ký"}
                </button>
              </form>

              {/* DIVIDER */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-gray-400">
                    Hoặc đăng ký với
                  </span>
                </div>
              </div>

              {/* SOCIAL BUTTONS */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    toast.info("Đăng ký bằng Google đang được phát triển.")
                  }
                  className="h-10 px-4 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  onClick={() =>
                    toast.info("Đăng ký bằng Facebook đang được phát triển.")
                  }
                  className="h-10 px-4 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition"
                >
                  <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>

              {/* FOOTER */}
              <p className="text-center text-xs text-gray-500 mt-6">
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-blue-700 font-semibold hover:underline"
                >
                  Đăng nhập
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

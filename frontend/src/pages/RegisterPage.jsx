import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "job_seeker",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // =========================
  // HANDLE INPUT
  // =========================
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

  // =========================
  // VALIDATE
  // =========================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Họ và tên phải có ít nhất 2 ký tự";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!formData.agree) {
      newErrors.agree =
        "Bạn cần đồng ý với điều khoản sử dụng";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      role: formData.role,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };

    console.log("===== DỮ LIỆU ĐĂNG KÝ =====");
    console.log(payload);

    try {
      setLoading(true);

      const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:8080";

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log("===== API RESPONSE =====");
      console.log(data);

      if (!response.ok) {
        throw new Error(
          data.message || "Đăng ký thất bại"
        );
      }

      // ĐĂNG KÝ THÀNH CÔNG
      // CHUYỂN SANG TRANG OTP
      navigate("/verify-otp", {
        state: {
          email: formData.email.trim(),
        },
      });
    } catch (error) {
      console.error("Lỗi đăng ký:", error);

      alert(
        error.message ||
          "Không thể kết nối đến server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex">

      {/* ================= LEFT ================= */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-blue-800">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950" />

        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12 lg:p-16 text-white">

          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">

              <svg
                className="w-5 h-5"
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

            <span className="text-2xl font-bold">
              JobCrawler
            </span>
          </div>

          {/* CONTENT */}
          <div className="max-w-md my-auto py-10">

            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight">
              Khám phá cơ hội
              <br />
              Nâng tầm sự nghiệp.
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-blue-100">
              Nền tảng tuyển dụng thông minh kết nối
              nhân tài với những doanh nghiệp hàng đầu.
              Đăng ký ngay để bắt đầu hành trình mới.
            </p>

          </div>

          {/* USERS */}
          <div className="flex items-center gap-4">

            <div className="flex -space-x-2">

              <div className="w-9 h-9 rounded-full bg-blue-400 border-2 border-blue-800" />

              <div className="w-9 h-9 rounded-full bg-blue-300 border-2 border-blue-800" />

              <div className="w-9 h-9 rounded-full bg-indigo-400 border-2 border-blue-800" />

            </div>

            <span className="text-xs">
              Tham gia cùng{" "}
              <strong>+10,000</strong> chuyên gia
            </span>

          </div>

        </div>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-6 sm:p-12 bg-white overflow-y-auto">

        <div className="w-full max-w-md">

          <div className="mb-6">

            <h1 className="text-2xl font-bold text-gray-900">
              Tạo tài khoản
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Điền thông tin bên dưới để tham gia JobCrawler.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* ROLE */}
            <div>

              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                Bạn là ai?
              </label>

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      role: "job_seeker",
                    }))
                  }
                  className={`h-11 rounded-xl border text-sm font-medium transition ${
                    formData.role === "job_seeker"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  👤 Người tìm việc
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      role: "employer",
                    }))
                  }
                  className={`h-11 rounded-xl border text-sm font-medium transition ${
                    formData.role === "employer"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  🏢 Nhà tuyển dụng
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
                className={`w-full h-10 px-3.5 border rounded-lg text-sm outline-none ${
                  errors.fullName
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-600"
                }`}
              />

              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.fullName}
                </p>
              )}

            </div>

            {/* EMAIL */}
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
                className={`w-full h-10 px-3.5 border rounded-lg text-sm outline-none ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-600"
                }`}
              />

              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email}
                </p>
              )}

            </div>

            {/* PASSWORD */}
            <div>

              <label className="block text-xs font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full h-10 px-3.5 pr-12 border rounded-lg text-sm outline-none ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-300 focus:border-blue-600"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>

              </div>

              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password}
                </p>
              )}

            </div>

            {/* CONFIRM PASSWORD */}
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
                className={`w-full h-10 px-3.5 border rounded-lg text-sm outline-none ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-600"
                }`}
              />

              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword}
                </p>
              )}

            </div>

            {/* TERMS */}
            <div>

              <label className="flex items-start gap-2 cursor-pointer">

                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="mt-1"
                />

                <span className="text-xs text-gray-600">
                  Tôi đồng ý với{" "}
                  <span className="text-blue-600">
                    điều khoản sử dụng
                  </span>{" "}
                  và{" "}
                  <span className="text-blue-600">
                    chính sách bảo mật
                  </span>
                </span>

              </label>

              {errors.agree && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.agree}
                </p>
              )}

            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition disabled:opacity-60"
            >
              {loading
                ? "Đang đăng ký..."
                : "Đăng ký"}
            </button>

          </form>

          {/* LOGIN */}
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

        </div>

      </div>
    </div>
  );
}

export default RegisterPage;
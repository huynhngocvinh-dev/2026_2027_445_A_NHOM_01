import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiBriefcase, FiEye, FiEyeOff, FiUsers, FiUser } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { authApi } from "../api/authApi";
import { ApiError } from "../lib/apiClient";
import { ROLES } from "../constants/roles";
import FormField from "../components/form/FormField";

// UI dùng "job_seeker"/"employer" cho dễ đọc, backend cần đúng giá trị role thật
const ROLE_MAP = { job_seeker: ROLES.CANDIDATE, employer: ROLES.EMPLOYER };

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

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
    } else if (
      !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/.test(formData.password)
    ) {
      newErrors.password = "Mật khẩu cần ít nhất 8 ký tự, gồm hoa, thường, số và ký tự đặc biệt";
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

      toast.success("Đăng ký thành công! Vui lòng nhập mã OTP đã gửi tới email của bạn.");
      // Chuyển sang trang xác thực OTP riêng (OtpPage) - tránh trùng lặp
      // UI nhập OTP thêm lần nữa ngay trong trang đăng ký.
      navigate("/verify-otp", { state: { email: formData.email.trim() } });
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        const { phoneNumber, ...rest } = error.fieldErrors;
        setErrors((prev) => ({ ...prev, ...rest, ...(phoneNumber ? { phone: phoneNumber } : {}) }));
      }
      toast.error(error instanceof ApiError ? error.message : "Không thể kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegisterPlaceholder = (provider) => {
    toast.info(`Đăng ký bằng ${provider} đang được phát triển.`);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex">
      {/* ================= LEFT SIDE ================= */}
      <div className="hidden md:flex md:w-1/2 relative bg-[#1e40af] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 opacity-90" />
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12 lg:p-16 text-white">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
              <FiBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">JobFinder</span>
          </div>

          {/* Tiêu đề & Nội dung */}
          <div className="max-w-md my-auto py-10">
            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-white">
              Khám phá cơ hội <br />
              Nâng tầm sự nghiệp.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-blue-100/80">
              Nền tảng tuyển dụng thông minh kết nối nhân tài với những doanh nghiệp hàng đầu.
              Đăng ký ngay để bắt đầu hành trình mới.
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
              Tham gia cùng <strong className="text-white font-semibold">+10,000</strong> chuyên gia
            </span>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Tạo tài khoản</h2>
            <p className="mt-1 text-sm text-gray-500">Điền thông tin bên dưới để tham gia JobFinder.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ROLE SELECTOR */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                Bạn là ai?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: "job_seeker" }))}
                  className={`h-11 px-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    formData.role === "job_seeker"
                      ? "border-blue-600 bg-blue-50/60 text-blue-700 ring-2 ring-blue-600/20"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <FiUser size={16} />
                  Người tìm việc
                </button>

                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: "employer" }))}
                  className={`h-11 px-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    formData.role === "employer"
                      ? "border-blue-600 bg-blue-50/60 text-blue-700 ring-2 ring-blue-600/20"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <FiUsers size={16} />
                  Nhà tuyển dụng
                </button>
              </div>
            </div>

            <FormField
              size="sm"
              label="Họ và tên"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              error={errors.fullName}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                size="sm"
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                error={errors.email}
              />
              <FormField
                size="sm"
                label="Số điện thoại"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0901234567"
                error={errors.phone}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                size="sm"
                label="Mật khẩu"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                error={errors.password}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                }
              />
              <FormField
                size="sm"
                label="Xác nhận mật khẩu"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                error={errors.confirmPassword}
              />
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
                  <button type="button" className="text-blue-600 font-medium hover:underline">
                    điều khoản sử dụng
                  </button>{" "}
                  và{" "}
                  <button type="button" className="text-blue-600 font-medium hover:underline">
                    chính sách bảo mật
                  </button>
                </span>
              </label>
              {errors.agree && <p className="mt-1 text-xs text-red-500 font-medium">{errors.agree}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-400">Hoặc đăng ký với</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialRegisterPlaceholder("Google")}
              className="h-10 px-4 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition"
            >
              <FcGoogle size={16} />
              Google
            </button>

            <button
              type="button"
              onClick={() => handleSocialRegisterPlaceholder("Facebook")}
              className="h-10 px-4 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition"
            >
              <FaFacebook size={16} className="text-[#1877F2]" />
              Facebook
            </button>
          </div>

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

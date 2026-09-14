import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "../lib/apiClient";
import { ROLES } from "../constants/roles";

// Sau khi đăng nhập, điều hướng theo role: admin vào trang quản trị,
// còn lại quay về trang trước đó (nếu bị ProtectedRoute đá ra) hoặc trang chủ.
function resolveRedirectPath(role, fromPath) {
  if (role === ROLES.ADMIN) return "/admin";
  return fromPath || "/";
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithSocial } = useAuth();
  const fromPath = location.state?.from?.pathname;

  const [formData, setFormData] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const authResponse = await login({ email: formData.email.trim(), password: formData.password });
      toast.success("Đăng nhập thành công!");
      navigate(resolveRedirectPath(authResponse.role, fromPath), { replace: true });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Đăng nhập Google/Facebook thật cần tích hợp SDK riêng (Google Identity
  // Services / Facebook Login) để lấy id token, rồi gọi loginWithSocial({
  // email, fullName, provider, providerId }) map sang API /auth/social-login
  // đã có sẵn ở backend. Tạm thời báo cho người dùng biết chưa khả dụng.
  const handleSocialLoginPlaceholder = (provider) => {
    toast.info(`Đăng nhập bằng ${provider} đang được phát triển.`);
    void loginWithSocial;
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-6 py-10">
      {/* BACKGROUND XANH - phủ toàn bộ màn hình */}
      <div className="fixed inset-0 overflow-hidden -z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#dbe9f8] via-[#b8d3f0] to-[#82acd8]" />
        <div
          className="absolute top-[12%] left-[7%] w-20 h-20 bg-gradient-to-br from-[#0b4b9b] to-[#2784cf] shadow-xl rotate-[25deg]"
          style={{ clipPath: "polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)" }}
        />
        <div className="absolute top-[18%] left-[18%] w-6 h-6 rounded-full bg-[#1468b8] shadow-lg" />
        <div className="absolute top-[4%] right-[7%] w-12 h-12 rounded-lg bg-gradient-to-br from-[#0b4b9b] to-[#2784cf] shadow-xl rotate-[25deg]" />
        <div className="absolute bottom-[22%] right-[8%] w-12 h-12 rounded-lg bg-gradient-to-br from-[#0b4b9b] to-[#2784cf] shadow-xl rotate-[25deg]" />
        <div className="absolute bottom-[6%] left-[6%] w-14 h-14 rounded-lg bg-gradient-to-br from-[#0b4b9b] to-[#2784cf] shadow-xl rotate-[25deg]" />
        <div className="absolute bottom-[-2%] right-[25%] w-9 h-9 rounded-lg bg-gradient-to-br from-[#0b4b9b] to-[#2784cf] shadow-xl rotate-[25deg]" />
      </div>

      {/* FORM LOGIN */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-[#f8f9fc] shadow-2xl px-10 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Chào mừng trở lại</h1>
          <p className="text-sm text-gray-500">Vui lòng đăng nhập vào tài khoản của bạn.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* EMAIL */}
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập Email của bạn"
                className={`w-full h-11 rounded-lg border bg-white pl-11 pr-4 text-sm outline-none transition ${
                  errors.email
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                }`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <button
                type="button"
                onClick={() => toast.info("Tính năng quên mật khẩu đang được phát triển.")}
                className="text-xs text-blue-600 hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full h-11 rounded-lg border bg-white pl-11 pr-16 text-sm outline-none transition ${
                  errors.password
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-blue-600"
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          {/* GHI NHỚ */}
          <div className="mb-6 flex items-center gap-2">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={formData.remember}
              onChange={handleChange}
              className="h-4 w-4 cursor-pointer accent-blue-700"
            />
            <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
              Ghi nhớ đăng nhập
            </label>
          </div>

          {/* ĐĂNG NHẬP */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-full bg-[#062d82] text-white text-sm font-semibold transition hover:bg-[#041f5d] hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          {/* ĐĂNG KÝ */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full h-11 mt-3 rounded-full border border-gray-300 bg-white text-blue-800 text-sm transition hover:bg-gray-50"
          >
            Đăng ký tài khoản mới
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-7">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400 whitespace-nowrap">Hoặc đăng nhập với</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* GOOGLE + FACEBOOK */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLoginPlaceholder("Google")}
              className="h-10 rounded-full border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <FcGoogle size={16} />
              Google
            </button>

            <button
              type="button"
              onClick={() => handleSocialLoginPlaceholder("Facebook")}
              className="h-10 rounded-full border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <FaFacebook size={16} className="text-[#1877F2]" />
              Facebook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

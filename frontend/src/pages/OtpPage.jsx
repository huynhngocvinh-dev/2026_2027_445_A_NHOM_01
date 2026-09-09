import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Nhận email từ RegisterPage
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(59);

  const inputRefs = useRef([]);

  // =========================
  // COUNTDOWN
  // =========================
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // =========================
  // NHẬP OTP
  // =========================
  const handleOtpChange = (index, value) => {
    // Chỉ cho nhập số
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    // Chỉ lấy 1 ký tự cuối
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);
    setError("");

    // Tự động chuyển sang ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // =========================
  // XỬ LÝ BACKSPACE
  // =========================
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // =========================
  // VERIFY OTP
  // =========================
  const handleVerify = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");

    // Kiểm tra đủ 6 số
    if (otpCode.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 số OTP");
      return;
    }

    // Kiểm tra email
    if (!email) {
      setError("Không tìm thấy email. Vui lòng đăng ký lại.");
      return;
    }

    console.log("========== XÁC THỰC OTP ==========");
    console.log("Email:", email);
    console.log("OTP:", otpCode);

    try {
      setLoading(true);
      setError("");

      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:8080";

      const response = await fetch(
        `${API_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: otpCode,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log("OTP RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Mã OTP không chính xác"
        );
      }

      alert("Xác thực tài khoản thành công!");

      // Chuyển về trang đăng nhập
      navigate("/login");

    } catch (error) {
      console.error("Lỗi xác thực OTP:", error);

      setError(
        error.message || "Không thể kết nối đến server"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GỬI LẠI OTP
  // =========================
  const handleResend = async () => {
    if (countdown > 0) {
      return;
    }

    if (!email) {
      setError("Không tìm thấy email. Vui lòng đăng ký lại.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:8080";

      const response = await fetch(
        `${API_URL}/api/auth/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Không thể gửi lại OTP"
        );
      }

      // Reset OTP
      setOtp(["", "", "", "", "", ""]);

      // Reset countdown
      setCountdown(59);

      // Focus ô đầu tiên
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);

      alert("Đã gửi lại mã OTP!");

    } catch (error) {
      console.error("Lỗi gửi lại OTP:", error);

      setError(
        error.message || "Không thể gửi lại OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex">

      {/* =========================================
          LEFT SIDE
      ========================================== */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-white" />

        {/* Decorative shapes */}
        <div className="absolute top-12 left-10 w-16 h-16 bg-blue-700/30 rotate-12 rounded-lg" />

        <div className="absolute top-36 right-16 w-12 h-12 bg-blue-600/40 rotate-12 rounded-lg" />

        <div className="absolute bottom-28 left-8 w-24 h-24 bg-blue-800/30 rotate-12 rounded-xl" />

        <div className="absolute bottom-12 right-20 w-14 h-14 bg-blue-600/30 rounded-full" />

        <div className="absolute top-20 right-40 w-8 h-8 bg-blue-500/30 rounded-full" />

        {/* Content */}
        <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-12">

          {/* LOGO */}
          <div className="flex items-center gap-2 mb-8">

            <div className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center">
              <span className="text-xl">
                🚀
              </span>
            </div>

            <span className="text-2xl font-bold text-blue-900">
              JobFinder
            </span>

          </div>

          {/* CARD */}
          <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl font-bold text-blue-900 text-center">
              Đăng nhập và Xác thực OTP
            </h2>

            <p className="mt-4 text-sm text-gray-500 text-center leading-relaxed">
              Kết nối nhân tài công nghệ với những cơ hội
              hàng đầu. Đăng nhập để tiếp tục hành trình
              sự nghiệp của bạn.
            </p>

          </div>

        </div>
      </div>

      {/* =========================================
          RIGHT SIDE
      ========================================== */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center bg-[#f8f9ff] px-6 sm:px-12">

        <div className="w-full max-w-md">

          {/* HEADER */}
          <div className="mb-7">

            <h1 className="text-2xl font-bold text-gray-900">
              Xác thực tài khoản
            </h1>

            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Chúng tôi đã gửi mã OTP gồm 6 chữ số đến
              email của bạn. Vui lòng nhập mã để tiếp tục.
            </p>

            {email && (
              <p className="mt-2 text-sm font-semibold text-gray-700">
                {email}
              </p>
            )}

          </div>

          {/* FORM */}
          <form onSubmit={handleVerify}>

            {/* OTP INPUTS */}
            <div className="flex justify-between gap-2">

              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(
                      index,
                      e.target.value
                    )
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(index, e)
                  }
                  className="
                    w-11
                    h-11
                    sm:w-12
                    sm:h-12
                    text-center
                    text-lg
                    font-semibold
                    bg-white
                    border
                    border-gray-300
                    rounded-lg
                    outline-none
                    transition
                    focus:border-blue-600
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />
              ))}

            </div>

            {/* ERROR */}
            {error && (
              <p className="mt-3 text-center text-xs text-red-500 font-medium">
                {error}
              </p>
            )}

            {/* RESEND */}
            <div className="mt-5 text-center text-xs text-gray-500">

              Chưa nhận được mã?{" "}

              {countdown > 0 ? (
                <span className="text-blue-600 font-medium">
                  Gửi lại sau {countdown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-blue-600 font-semibold hover:underline disabled:opacity-50"
                >
                  Gửi lại mã
                </button>
              )}

            </div>

            {/* VERIFY BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-11
                mt-5
                rounded-full
                bg-blue-900
                hover:bg-blue-950
                text-white
                text-sm
                font-semibold
                transition
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {loading
                ? "Đang xác nhận..."
                : "Xác nhận mã"}
            </button>

          </form>

          {/* BACK */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="
              w-full
              mt-5
              text-sm
              text-gray-500
              hover:text-blue-700
              transition
            "
          >
            ← Quay lại trang đăng ký
          </button>

        </div>
      </div>

    </div>
  );
}

export default OtpPage;
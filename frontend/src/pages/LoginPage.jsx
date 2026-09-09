import { useState } from "react";

function LoginPage() {
  // STATE
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  // HANDLE CHANGE
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

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  // HANDLE SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("❌ Dữ liệu không hợp lệ");
      return;
    }

    const loginData = {
      email: formData.email,
      password: formData.password,
      remember: formData.remember,
    };

    console.log("========== LOGIN ==========");
    console.log("Dữ liệu chuẩn bị gửi API:");
    console.log(loginData);
    console.log("===========================");
  };

  // JSX

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-6 py-10">

    {/* ==============================
    BACKGROUND XANH
    Phủ TOÀN BỘ màn hình
============================== */}

<div className="fixed inset-0 overflow-hidden -z-0">

  {/* Nền xanh toàn màn hình */}
  <div
    className="
      absolute
      inset-0
      bg-gradient-to-br
      from-[#dbe9f8]
      via-[#b8d3f0]
      to-[#82acd8]
    "
  ></div>


  {/* Hình khối 1 */}
  <div
    className="
      absolute
      top-[12%]
      left-[7%]
      w-20
      h-20
      bg-gradient-to-br
      from-[#0b4b9b]
      to-[#2784cf]
      shadow-xl
      rotate-[25deg]
    "
    style={{
      clipPath:
        "polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)",
    }}
  ></div>


  {/* Hình tròn */}
  <div
    className="
      absolute
      top-[18%]
      left-[18%]
      w-6
      h-6
      rounded-full
      bg-[#1468b8]
      shadow-lg
    "
  ></div>


  {/* Hình khối góc phải trên */}
  <div
    className="
      absolute
      top-[4%]
      right-[7%]
      w-12
      h-12
      rounded-lg
      bg-gradient-to-br
      from-[#0b4b9b]
      to-[#2784cf]
      shadow-xl
      rotate-[25deg]
    "
  ></div>


  {/* Hình khối bên phải */}
  <div
    className="
      absolute
      bottom-[22%]
      right-[8%]
      w-12
      h-12
      rounded-lg
      bg-gradient-to-br
      from-[#0b4b9b]
      to-[#2784cf]
      shadow-xl
      rotate-[25deg]
    "
  ></div>


  {/* Hình khối góc trái dưới */}
  <div
    className="
      absolute
      bottom-[6%]
      left-[6%]
      w-14
      h-14
      rounded-lg
      bg-gradient-to-br
      from-[#0b4b9b]
      to-[#2784cf]
      shadow-xl
      rotate-[25deg]
    "
  ></div>


  {/* Hình khối nhỏ phía dưới */}
  <div
    className="
      absolute
      bottom-[-2%]
      right-[25%]
      w-9
      h-9
      rounded-lg
      bg-gradient-to-br
      from-[#0b4b9b]
      to-[#2784cf]
      shadow-xl
      rotate-[25deg]
    "
  ></div>

</div>


{/* ==============================
    FORM LOGIN
============================== */}

<div
  className="
    relative
    z-10
    w-full
    max-w-md
    rounded-2xl
    bg-[#f8f9fc]
    shadow-2xl
    px-10
    py-12
  "
>

        {/* 
            HEADER
      */}

        <div className="mb-8">

          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Chào mừng trở lại
          </h1>

          <p className="text-sm text-gray-500">
            Vui lòng đăng nhập vào tài khoản của bạn.
          </p>

        </div>


        {/* ==========================
            FORM
        ========================== */}

        <form
          onSubmit={handleSubmit}
          noValidate
        >

          {/* EMAIL */}

          <div className="mb-5">

            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <div className="relative">

              <span
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              >
                ✉
              </span>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập Email của bạn"

                className={`
                  w-full
                  h-11
                  rounded-lg
                  border
                  bg-white
                  pl-11
                  pr-4
                  text-sm
                  outline-none
                  transition

                  ${
                    errors.email
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  }
                `}
              />

            </div>

            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email}
              </p>
            )}

          </div>


          {/* PASSWORD */}

          <div className="mb-4">

            <div className="flex items-center justify-between mb-2">

              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>

              <button
                type="button"
                className="text-xs text-blue-600 hover:underline"
              >
                Quên mật khẩu?
              </button>

            </div>


            <div className="relative">

              <span
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              >
                🔒
              </span>


              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"

                className={`
                  w-full
                  h-11
                  rounded-lg
                  border
                  bg-white
                  pl-11
                  pr-16
                  text-sm
                  outline-none
                  transition

                  ${
                    errors.password
                      ? "border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  }
                `}
              />


              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }

                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-xs
                  text-gray-500
                  hover:text-blue-600
                "
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


          {/* GHI NHỚ */}

          <div className="mb-6 flex items-center gap-2">

            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={formData.remember}
              onChange={handleChange}

              className="
                h-4
                w-4
                cursor-pointer
                accent-blue-700
              "
            />

            <label
              htmlFor="remember"
              className="
                text-sm
                text-gray-600
                cursor-pointer
              "
            >
              Ghi nhớ đăng nhập
            </label>

          </div>


          {/* ĐĂNG NHẬP */}

          <button
            type="submit"

            className="
              w-full
              h-11
              rounded-full
              bg-[#062d82]
              text-white
              text-sm
              font-semibold
              transition
              hover:bg-[#041f5d]
              hover:-translate-y-[1px]
            "
          >
            Đăng nhập
          </button>


          {/* ĐĂNG KÝ */}

          <button
            type="button"

            className="
              w-full
              h-11
              mt-3
              rounded-full
              border
              border-gray-300
              bg-white
              text-blue-800
              text-sm
              transition
              hover:bg-gray-50
            "
          >
            Đăng ký tài khoản mới
          </button>


          {/* DIVIDER */}

          <div
            className="
              flex
              items-center
              gap-3
              my-7
            "
          >

            <div className="h-px flex-1 bg-gray-200"></div>

            <span
              className="
                text-xs
                text-gray-400
                whitespace-nowrap
              "
            >
              Hoặc đăng nhập với
            </span>

            <div className="h-px flex-1 bg-gray-200"></div>

          </div>


          {/* GOOGLE + FACEBOOK */}

          <div className="grid grid-cols-2 gap-3">

            <button
              type="button"

              className="
                h-10
                rounded-full
                border
                border-gray-300
                bg-white
                text-sm
                text-gray-700
                hover:bg-gray-50
                transition
              "
            >
              <span className="font-bold text-blue-500 mr-2">
                G
              </span>

              Google
            </button>


            <button
              type="button"

              className="
                h-10
                rounded-full
                border
                border-gray-300
                bg-white
                text-sm
                text-gray-700
                hover:bg-gray-50
                transition
              "
            >
              <span className="font-bold text-blue-500 mr-2">
                f
              </span>

              Facebook
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default LoginPage;
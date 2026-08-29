//Binh lam
import { useState } from "react";
import "./LoginPage.css";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="login-page">

      {/* NỀN XANH */}
      <div className="background">

        <span className="shape shape-1"></span>
        <span className="shape shape-2"></span>
        <span className="shape shape-3"></span>
        <span className="shape shape-4"></span>
        <span className="shape shape-5"></span>
        <span className="shape shape-6"></span>
        <span className="shape shape-7"></span>

      </div>


      {/* FORM LOGIN */}
      <div className="login-form-wrapper">

        <div className="login-header">
          <h1>Chào mừng trở lại</h1>

          <p>
            Vui lòng đăng nhập vào tài khoản của bạn.
          </p>
        </div>


        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <div className="input-wrapper">

              <span className="input-icon">
                ✉
              </span>

              <input
                id="email"
                type="email"
                placeholder="name@company.com"
              />

            </div>

          </div>


          {/* PASSWORD */}
          <div className="form-group">

            <div className="password-label">

              <label htmlFor="password">
                Mật khẩu
              </label>

              <button
                type="button"
                className="forgot-password"
              >
                Quên mật khẩu?
              </button>

            </div>


            <div className="input-wrapper">

              <span className="input-icon">
                🔒
              </span>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "◉" : "◌"}
              </button>

            </div>

          </div>


          {/* REMEMBER */}
          <div className="remember-row">

            <label>

              <input type="checkbox" />

              <span>
                Ghi nhớ đăng nhập
              </span>

            </label>

          </div>


          {/* LOGIN */}
          <button
            type="submit"
            className="login-button"
          >
            Đăng nhập
          </button>


          {/* REGISTER */}
          <button
            type="button"
            className="register-button"
          >
            Đăng ký tài khoản mới
          </button>


          {/* DIVIDER */}
          <div className="divider">

            <span></span>

            <p>Hoặc đăng nhập với</p>

            <span></span>

          </div>


          {/* SOCIAL */}
          <div className="social-buttons">

            <button
              type="button"
              className="social-button"
            >
              <span className="google-icon">G</span>
              <span>Google</span>
            </button>


            <button
              type="button"
              className="social-button"
            >
              <span className="facebook-icon">f</span>
              <span>Facebook</span>
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default LoginPage;
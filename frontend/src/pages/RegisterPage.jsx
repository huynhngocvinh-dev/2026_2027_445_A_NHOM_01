//binh lam

import { useState } from "react";
import "./RegistryPage.css";

function RegistryPage() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Frontend only - chưa xử lý API / Database
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="registry-page">

      <div className="registry-container">

        {/*
            TABS
         */}

        <div className="registry-tabs">

          <button
            type="button"
            className="registry-tab"
          >
            Đăng nhập
          </button>

          <button
            type="button"
            className="registry-tab active"
          >
            Đăng ký
          </button>

        </div>


        {/* =================================
            HEADER
        ================================= */}

        <div className="registry-header">

          <h1>
            Tạo tài khoản mới
          </h1>

          <p>
            Bắt đầu hành trình nghề nghiệp của bạn
          </p>

        </div>


        {/* =================================
            FORM
        ================================= */}

        <form
          className="registry-form"
          onSubmit={handleSubmit}
        >

          {/* HỌ TÊN */}

          <div className="registry-group">

            <label htmlFor="fullName">
              Họ tên
            </label>

            <input
              id="fullName"
              type="text"
              className="registry-input"
              placeholder="Nguyễn Văn A"
            />

          </div>


          {/* EMAIL + SỐ ĐIỆN THOẠI */}

          <div className="registry-row">

            <div className="registry-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                className="registry-input"
                placeholder="name@example.com"
              />

            </div>


            <div className="registry-group">

              <label htmlFor="phone">
                Số điện thoại
              </label>

              <input
                id="phone"
                type="tel"
                className="registry-input"
                placeholder="090 123 4567"
              />

            </div>

          </div>


          {/* MẬT KHẨU + XÁC NHẬN */}

          <div className="registry-row">

            {/* PASSWORD */}

            <div className="registry-group">

              <label htmlFor="password">
                Mật khẩu
              </label>

              <div className="registry-password-wrapper">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  className="registry-input"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  className="password-eye"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "◉" : "◌"}
                </button>

              </div>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="registry-group">

              <label htmlFor="confirmPassword">
                Xác nhận mật khẩu
              </label>

              <div className="registry-password-wrapper">

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  className="registry-input"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  className="password-eye"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? "◉" : "◌"}
                </button>

              </div>

            </div>

          </div>


          {/* =================================
              TIẾP TỤC
          ================================= */}

          <button
            type="submit"
            className="registry-submit"
          >
            Tiếp tục →
          </button>


          {/* =================================
              GOOGLE + FACEBOOK
          ================================= */}

          <div className="registry-divider">

            <span></span>

            <p>
              Hoặc đăng ký với
            </p>

            <span></span>

          </div>


          <div className="registry-social">

            <button
              type="button"
              className="registry-social-button"
            >

              <span className="registry-google-icon">
                G
              </span>

              Google

            </button>


            <button
              type="button"
              className="registry-social-button"
            >

              <span className="registry-facebook-icon">
                f
              </span>

              Facebook

            </button>

          </div>


          {/* =================================
              GOOGLE + LINKEDIN
          ================================= */}

          <div className="other-login-divider">

            <span></span>

            <p>
              Hoặc tiếp tục với
            </p>

            <span></span>

          </div>


          <div className="other-login-buttons">

            <button
              type="button"
              className="other-login-button"
            >
              Google
            </button>


            <button
              type="button"
              className="other-login-button"
            >
              LinkedIn
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default RegistryPage;

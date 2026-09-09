<<<<<<< HEAD
// Ban ĐẦu
/* function App() {
=======
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OtpPage from "./pages/OtpPage";

function App() {
>>>>>>> dev/ThuyVuong
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route path="/verify-otp" element={<OtpPage />} />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

<<<<<<< HEAD
export default App */


// Đăng Nhập
import LoginPage from "./pages/LoginPage";

function App() {
  return <LoginPage />;
}

=======
>>>>>>> dev/ThuyVuong
export default App;
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OtpPage from "./pages/OtpPage";
import CreateJobPage from "./pages/Jobs/CreateJobPage";
import ProfilePage from "./pages/User/ProfilePage";

function App() {
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
       <Route path="/profile" element={<ProfilePage />} />
    <Route
        path="/create-job"
        element={<CreateJobPage />}
      />

    </Routes>
    
  );
}

export default App;
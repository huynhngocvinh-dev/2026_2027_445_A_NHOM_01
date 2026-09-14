import { api } from "../lib/apiClient";

// Khớp 1-1 với AuthController phía backend (RESTful: POST để tạo phiên/tài khoản,
// GET để đọc thông tin người dùng hiện tại)
export const authApi = {
  register: (payload) => api.post("/auth/register", payload, { auth: false }),
  verifyOtp: (payload) => api.post("/auth/verify-otp", payload, { auth: false }),
  resendOtp: (payload) => api.post("/auth/resend-otp", payload, { auth: false }),
  login: (payload) => api.post("/auth/login", payload, { auth: false }),
  socialLogin: (payload) => api.post("/auth/social-login", payload, { auth: false }),
  me: () => api.get("/auth/me"),
  updateProfile: (payload) => api.put("/auth/me", payload),
};

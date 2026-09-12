import { api } from "./Apiclient";

export const authApi = {
  register: (payload) => api.post("/auth/register", payload, { auth: false }),
  verifyOtp: (payload) => api.post("/auth/verify-otp", payload, { auth: false }),
  login: (payload) => api.post("/auth/login", payload, { auth: false }),
  socialLogin: (payload) => api.post("/auth/social-login", payload, { auth: false }),
  me: () => api.get("/auth/me"),
};

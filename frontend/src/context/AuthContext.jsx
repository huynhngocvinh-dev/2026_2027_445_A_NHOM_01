import { useCallback, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi";
import { tokenStorage } from "../lib/apiClient";
import { AuthContext } from "./authContextObject";

/**
 * Bọc quanh toàn bộ App (xem main.jsx). Chịu trách nhiệm:
 * - Khi tải trang: nếu có token đã lưu -> gọi /auth/me để khôi phục phiên đăng nhập
 * - Cung cấp login()/loginWithSocial()/logout() cho LoginPage, RegisterPage...
 * - Cung cấp { user, role, isAuthenticated, isLoading } cho Header, ProtectedRoute, layouts...
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(() => !!tokenStorage.get());

  useEffect(() => {
    if (!tokenStorage.get()) return;

    authApi
      .me()
      .then((summary) => setUser(summary))
      .catch(() => tokenStorage.clear())
      .finally(() => setIsLoading(false));
  }, []);

  // Dùng chung cho login thường và social-login: cả 2 endpoint backend
  // đều trả về { token, userId, email, fullName, role }
  const loginWithAuthResponse = useCallback((authResponse) => {
    tokenStorage.set(authResponse.token);
    setUser({
      userId: authResponse.userId,
      email: authResponse.email,
      fullName: authResponse.fullName,
      role: authResponse.role,
      verified: true,
    });
  }, []);

  const login = useCallback(
    async (credentials) => {
      const authResponse = await authApi.login(credentials);
      loginWithAuthResponse(authResponse);
      return authResponse;
    },
    [loginWithAuthResponse]
  );

  const loginWithSocial = useCallback(
    async (payload) => {
      const authResponse = await authApi.socialLogin(payload);
      loginWithAuthResponse(authResponse);
      return authResponse;
    },
    [loginWithAuthResponse]
  );

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: !!user,
      isLoading,
      login,
      loginWithSocial,
      logout,
    }),
    [user, isLoading, login, loginWithSocial, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

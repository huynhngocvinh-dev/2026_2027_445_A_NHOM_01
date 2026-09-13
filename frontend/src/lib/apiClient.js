const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const TOKEN_KEY = "jobfinder_token";

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

/**
 * Lỗi API dùng chung: luôn có .message (tiếng Việt, lấy từ backend)
 * và .status (mã HTTP) để nơi gọi tự quyết định xử lý (vd 401 -> logout).
 */
export class ApiError extends Error {
  constructor(message, status, fieldErrors) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors; // lỗi validate theo từng field, nếu có
  }
}

/**
 * Wrapper fetch RESTful dùng chung cho toàn app (mọi file trong /api dùng cái này,
 * không có file nào tự gọi fetch() trực tiếp nữa).
 * - Tự gắn Authorization: Bearer <token> nếu đã đăng nhập
 * - Tự parse JSON và "bóc" field .data từ ApiResponse chuẩn của backend
 * - Ném ApiError thống nhất khi success=false hoặc lỗi mạng
 */
export async function apiRequest(path, { method = "GET", body, headers, auth = true } = {}) {
  const finalHeaders = { "Content-Type": "application/json", ...headers };

  if (auth) {
    const token = tokenStorage.get();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Không thể kết nối tới server. Vui lòng kiểm tra mạng.", 0);
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok || (payload && payload.success === false)) {
    const message = payload?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
    const fieldErrors = payload?.data && typeof payload.data === "object" ? payload.data : undefined;
    throw new ApiError(message, response.status, fieldErrors);
  }

  return payload?.data ?? payload;
}

// method RESTful chuẩn: GET (đọc), POST (tạo), PUT (cập nhật toàn phần),
// PATCH (cập nhật một phần), DELETE (xóa)
export const api = {
  get: (path, options) => apiRequest(path, { ...options, method: "GET" }),
  post: (path, body, options) => apiRequest(path, { ...options, method: "POST", body }),
  put: (path, body, options) => apiRequest(path, { ...options, method: "PUT", body }),
  patch: (path, body, options) => apiRequest(path, { ...options, method: "PATCH", body }),
  del: (path, options) => apiRequest(path, { ...options, method: "DELETE" }),
};

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const TOKEN_KEY = "jobfinder_token";

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(message, status, fieldErrors) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export async function apiRequest(
  path,
  { method = "GET", body, headers, auth = true } = {}
) {
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
    throw new ApiError(
      "Không thể kết nối tới server. Vui lòng kiểm tra mạng.",
      0
    );
  }

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");

  // Đọc response theo đúng Content-Type (Text hoặc JSON)
  let rawData;
  if (isJson) {
    rawData = await response.json().catch(() => null);
  } else {
    rawData = await response.text().catch(() => null);
  }

  if (!response.ok) {
    // Nếu rawData là String (Text từ backend) thì lấy luôn làm message lỗi
    const message =
      typeof rawData === "string"
        ? rawData
        : rawData?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";

    const fieldErrors =
      rawData?.data && typeof rawData.data === "object"
        ? rawData.data
        : undefined;
    throw new ApiError(message, response.status, fieldErrors);
  }

  return rawData?.data ?? rawData;
}

export const api = {
  get: (path, options) => apiRequest(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    apiRequest(path, { ...options, method: "POST", body }),
  put: (path, body, options) =>
    apiRequest(path, { ...options, method: "PUT", body }),
  patch: (path, body, options) =>
    apiRequest(path, { ...options, method: "PATCH", body }),
  del: (path, options) => apiRequest(path, { ...options, method: "DELETE" }),
};

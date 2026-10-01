import { api } from "../lib/apiClient";

// Helper lấy ID người dùng chuẩn từ localStorage
const getUserId = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    // Ưu tiên userId theo đúng cấu trúc JSON backend trả về trong ảnh
    return user.userId || user.id || null; 
  } catch {
    return null;
  }
};

export const jobApi = {
  // Lấy danh sách việc làm nổi bật
  getFeaturedJobs: (limit = 6) =>
    api.get(`/jobs/featured?limit=${limit}`, { auth: false }),

  // Tìm kiếm & phân trang việc làm
  searchJobs: ({
    keyword = "",
    location = "",
    category = "",
    salaryRange = "",
    experience = "",
    page = 1,
    size = 6,
  } = {}) => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    if (category) params.set("category", category);
    if (salaryRange) params.set("salaryRange", salaryRange);
    if (experience) params.set("experience", experience);
    params.set("page", page);
    params.set("size", size);
    return api.get(`/jobs?${params.toString()}`, { auth: false });
  },

  getCategories: () => api.get("/jobs/categories", { auth: false }),
  getJobById: (id) => api.get(`/jobs/${id}`, { auth: false }),
  createJob: (payload) => api.post("/jobs/hr/create", payload),
  updateJob: (id, payload) => api.put(`/jobs/${id}`, payload),
  deleteJob: (id) => api.del(`/jobs/${id}`),

  // ===== MODULE LƯU JOB YÊU THÍCH =====

  // Lấy danh sách công việc đã lưu
  getSavedJobs: () => {
    const userId = getUserId();
    return api.get("/saved-jobs", {
      headers: { "X-User-Id": userId },
    });
  },

  // Lấy danh sách Mảng ID các job đã lưu
  getSavedJobIds: () => {
    const userId = getUserId();
    if (!userId) return Promise.resolve([]);
    return api.get("/saved-jobs/ids", {
      headers: { "X-User-Id": userId },
    });
  },

  // Toggle Lưu / Bỏ lưu công việc
  toggleSaveJob: (jobId) => {
    const userId = getUserId();
    if (!userId) return Promise.reject(new Error("Vui lòng đăng nhập để thực hiện thao tác này"));
    return api.post(`/saved-jobs/${jobId}`, {}, {
      headers: { "X-User-Id": userId },
    });
  },

  applyJob: (id, payload) => api.post(`/jobs/${id}/apply`, payload),
};
import { api } from "../lib/apiClient";

// Lớp gọi API RESTful cho module việc làm.
export const jobApi = {
  // Lấy danh sách việc làm nổi bật cho trang chủ
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

  // Lấy danh sách danh mục ngành nghề
  getCategories: () => api.get("/jobs/categories", { auth: false }),

  // Lấy chi tiết 1 việc làm
  getJobById: (id) => api.get(`/jobs/${id}`, { auth: false }),

  // SỬA TẠI ĐÂY: Khớp 100% với @PostMapping("/hr/create") trong JobController.java
  createJob: (payload) => api.post("/jobs/hr/create", payload),

  // Cập nhật & Xóa tin tuyển dụng
  updateJob: (id, payload) => api.put(`/jobs/${id}`, payload),
  deleteJob: (id) => api.del(`/jobs/${id}`),

  // Quản lý việc làm đã lưu
  getSavedJobs: () => api.get("/jobs/saved"),
  saveJob: (id) => api.post(`/jobs/${id}/save`),
  unsaveJob: (id) => api.del(`/jobs/${id}/save`),

  // Ứng tuyển việc làm
  applyJob: (id, payload) => api.post(`/jobs/${id}/apply`, payload),
};

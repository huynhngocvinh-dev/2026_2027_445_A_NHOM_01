import { api } from "../lib/apiClient";

// Lớp gọi API RESTful cho module việc làm. Backend cần triển khai các endpoint
// dưới đây (module crawl/job) theo đúng chữ ký REST tương ứng:
//   GET    /jobs                -> danh sách + tìm kiếm/lọc (query params)
//   GET    /jobs/featured       -> việc làm nổi bật cho trang chủ
//   GET    /jobs/categories     -> danh sách ngành nghề
//   GET    /jobs/:id            -> chi tiết 1 việc làm
//   POST   /jobs                -> tạo tin (employer/admin)
//   PUT    /jobs/:id            -> cập nhật tin
//   DELETE /jobs/:id            -> xóa tin
//   GET    /jobs/saved          -> danh sách việc đã lưu của user hiện tại
//   POST   /jobs/:id/save       -> lưu tin
//   DELETE /jobs/:id/save       -> bỏ lưu tin
//   POST   /jobs/:id/apply      -> ứng tuyển
export const jobApi = {
  getFeaturedJobs: (limit = 6) => api.get(`/jobs/featured?limit=${limit}`, { auth: false }),

  searchJobs: ({ keyword = "", location = "", category = "", type = "", page = 1, size = 9 } = {}) => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    if (category) params.set("category", category);
    if (type) params.set("type", type);
    params.set("page", page);
    params.set("size", size);
    return api.get(`/jobs?${params.toString()}`, { auth: false });
  },

  getCategories: () => api.get("/jobs/categories", { auth: false }),

  getJobById: (id) => api.get(`/jobs/${id}`, { auth: false }),

  createJob: (payload) => api.post("/jobs", payload),
  updateJob: (id, payload) => api.put(`/jobs/${id}`, payload),
  deleteJob: (id) => api.del(`/jobs/${id}`),

  getSavedJobs: () => api.get("/jobs/saved"),
  saveJob: (id) => api.post(`/jobs/${id}/save`),
  unsaveJob: (id) => api.del(`/jobs/${id}/save`),

  applyJob: (id, payload) => api.post(`/jobs/${id}/apply`, payload),
};

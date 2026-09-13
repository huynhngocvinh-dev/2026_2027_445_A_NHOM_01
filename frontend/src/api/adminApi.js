import { api } from "../lib/apiClient";

// Lớp gọi API RESTful cho khu vực quản trị. Backend cần triển khai các nhóm
// endpoint dưới đây (hiện tại các trang Admin đang dùng dữ liệu mẫu cục bộ -
// xem ghi chú "TODO(API)" trong từng trang - đổi sang gọi các hàm này khi
// backend đã có).
export const adminApi = {
  // Người dùng
  getUsers: (params = "") => api.get(`/admin/users${params}`),
  updateUserStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
  deleteUser: (id) => api.del(`/admin/users/${id}`),

  // Duyệt tin tuyển dụng
  getPendingJobs: () => api.get("/admin/jobs/pending"),
  approveJob: (id) => api.post(`/admin/jobs/${id}/approve`),
  rejectJob: (id, reason) => api.post(`/admin/jobs/${id}/reject`, { reason }),

  // Nguồn crawl
  getSources: () => api.get("/admin/sources"),
  createSource: (payload) => api.post("/admin/sources", payload),
  updateSource: (id, payload) => api.put(`/admin/sources/${id}`, payload),
  deleteSource: (id) => api.del(`/admin/sources/${id}`),
  triggerCrawl: (sourceId) => api.post(`/admin/sources/${sourceId}/crawl`),

  // Dữ liệu crawl / tin trùng lặp
  getCrawlLogs: () => api.get("/admin/crawl/logs"),
  getDuplicates: () => api.get("/admin/duplicates"),
  resolveDuplicate: (id, action) => api.post(`/admin/duplicates/${id}/resolve`, { action }),

  // Ứng tuyển & thống kê
  getApplications: (params = "") => api.get(`/admin/applications${params}`),
  getStatistics: (range = "7d") => api.get(`/admin/statistics?range=${range}`),
  getDashboardSummary: () => api.get("/admin/dashboard"),
};

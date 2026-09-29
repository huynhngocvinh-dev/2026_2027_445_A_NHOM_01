import { api } from "../lib/apiClient";

// Lớp gọi API khớp đúng với JobApprovalController.java (backend thật):
//   GET    /api/admin/approval/pending
//   POST   /api/admin/approval/approve/{id}
//   DELETE /api/admin/approval/reject/{id}
// Khác với src/api/adminApi.js (các endpoint /admin/jobs/*, /admin/sources/* ...
// hiện KHÔNG tồn tại ở backend) - dùng file này cho tính năng Duyệt tin AI.
export const crawlApprovalApi = {
  getPending: () => api.get("/admin/approval/pending"),
  approve: (rawJobId, formData) =>
    api.post(`/admin/approval/approve/${rawJobId}`, formData),
  reject: (rawJobId) => api.del(`/admin/approval/reject/${rawJobId}`),
};
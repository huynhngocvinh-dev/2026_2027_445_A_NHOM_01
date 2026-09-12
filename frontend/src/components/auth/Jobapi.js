import { MOCK_JOBS, JOB_CATEGORIES } from "./mockJobs";

// TODO: khi backend có module crawl xong (vd GET /api/jobs), thay nội dung các
// hàm dưới đây bằng lời gọi `api.get(...)` thật (xem api/authApi.js làm mẫu).
// Giữ nguyên chữ ký hàm (tên + tham số + shape dữ liệu trả về) để không phải
// sửa lại UI đang dùng jobApi ở HomePage / JobListPage.

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const jobApi = {
  async getFeaturedJobs(limit = 3) {
    await delay(200);
    return MOCK_JOBS.slice(0, limit);
  },

  async searchJobs({ keyword = "", location = "", category = "", type = "" } = {}) {
    await delay(300);
    return MOCK_JOBS.filter((job) => {
      const matchKeyword =
        !keyword ||
        job.title.toLowerCase().includes(keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(keyword.toLowerCase());
      const matchLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
      const matchCategory = !category || job.category === category;
      const matchType = !type || job.type === type;
      return matchKeyword && matchLocation && matchCategory && matchType;
    });
  },

  async getCategories() {
    await delay(150);
    return JOB_CATEGORIES;
  },
};
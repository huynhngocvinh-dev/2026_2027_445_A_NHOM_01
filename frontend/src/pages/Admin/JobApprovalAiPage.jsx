import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { FaCheck, FaTrash, FaSpinner, FaRobot } from "react-icons/fa";
import { crawlApprovalApi } from "../../api/crawlApprovalApi";

const EMPTY_FORM = {
  jobTitle: "",
  companyName: "",
  category: "",
  hrEmail: "",
  contactPhone: "",
  minSalary: "",
  maxSalary: "",
  location: "",
  jobType: "Full-time",
  requirements: "",
  benefits: "",
  description: "",
};

export default function JobApprovalAiPage() {
  const [rawJobs, setRawJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pollTimerRef = useRef(null);

  // Fetch danh sách bài cào chờ duyệt
  const fetchPendingJobs = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setIsLoadingList(true);
    try {
      const data = await crawlApprovalApi.getPending();
      const list = Array.isArray(data) ? data : [];
      setRawJobs(list);

      // Giữ nguyên lựa chọn hiện tại nếu vẫn còn trong danh sách (ví dụ sau khi
      // AI vừa xử lý xong parsedDataJson cho đúng bài đang xem), nếu không thì
      // chọn bài đầu tiên.
      setSelectedJob((current) => {
        if (current) {
          const stillThere = list.find((j) => j.id === current.id);
          if (stillThere) {
            applyJobToForm(stillThere);
            return stillThere;
          }
        }
        if (list.length > 0) {
          applyJobToForm(list[0]);
          return list[0];
        }
        setFormData(EMPTY_FORM);
        return null;
      });
    } catch (err) {
      toast.error("Không thể tải danh sách bài cào!");
    } finally {
      if (!silent) setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingJobs();
    // Poll nhẹ mỗi 5s để cập nhật khi AI xử lý xong bài mới (parsedDataJson
    // được backend điền bất đồng bộ, không có trong response ban đầu).
    pollTimerRef.current = setInterval(() => {
      fetchPendingJobs({ silent: true });
    }, 5000);
    return () => clearInterval(pollTimerRef.current);
  }, [fetchPendingJobs]);

  const applyJobToForm = (job) => {
    let parsed = {};
    if (job.parsedDataJson) {
      try {
        parsed =
          typeof job.parsedDataJson === "string"
            ? JSON.parse(job.parsedDataJson)
            : job.parsedDataJson;
      } catch (e) {
        console.error("Lỗi parse JSON bài đăng:", e);
        parsed = {};
      }
    }

    setFormData({
      jobTitle: parsed.jobTitle || "",
      companyName: parsed.companyName || "",
      category: parsed.category || "",
      hrEmail: parsed.hrEmail || "",
      contactPhone: parsed.contactPhone || "",
      minSalary: parsed.minSalary || "",
      maxSalary: parsed.maxSalary || "",
      location: parsed.location || "",
      jobType: parsed.jobType || "Full-time",
      requirements: parsed.requirements || "",
      benefits: parsed.benefits || "",
      description: parsed.description || job.rawContent || "",
    });
  };

  // Chọn bài cào và tự động điền dữ liệu đã bóc tách vào Form
  const handleSelectJob = (job) => {
    setSelectedJob(job);
    applyJobToForm(job);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Bấm Phê duyệt -> Lưu thông tin vào Database chính (`jobs`)
  const handleApprove = async () => {
    if (!selectedJob) return;
    if (!formData.jobTitle.trim()) {
      toast.warning("Tiêu đề công việc không được để trống!");
      return;
    }

    setIsSubmitting(true);
    try {
      await crawlApprovalApi.approve(selectedJob.id, formData);
      toast.success("Đã duyệt & Lưu thành công bài đăng vào Hệ thống!");
      await fetchPendingJobs();
    } catch (err) {
      toast.error("Lỗi khi lưu dữ liệu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Bấm Từ chối -> Đánh dấu REJECTED, loại khỏi hàng chờ
  const handleReject = async () => {
    if (!selectedJob) return;
    setIsSubmitting(true);
    try {
      await crawlApprovalApi.reject(selectedJob.id);
      toast.info("Đã từ chối bài đăng.");
      await fetchPendingJobs();
    } catch (err) {
      toast.error("Lỗi khi từ chối bài đăng!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSelectedStillProcessing = selectedJob && !selectedJob.parsedDataJson;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Duyệt Tin AI Real-time Parsing
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột trái: Danh sách bài cào thô */}
        <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-gray-200 h-[700px] flex flex-col">
          <h2 className="font-semibold text-gray-700 mb-3">
            Bài đăng thô chờ duyệt ({rawJobs.length})
          </h2>

          {isLoadingList ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 gap-2">
              <FaSpinner className="animate-spin" /> Đang tải danh sách...
            </div>
          ) : rawJobs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2 text-center px-4">
              <FaRobot className="text-3xl" />
              <p>Chưa có bài đăng nào chờ duyệt.</p>
              <p className="text-xs">
                Hãy chạy Bot cào dữ liệu ở trang "Quản lý Crawler" trước.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {rawJobs.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectJob(item)}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    selectedJob?.id === item.id
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-500">ID: #{item.id}</p>
                    {!item.parsedDataJson && (
                      <span className="text-xs text-amber-600 flex items-center gap-1">
                        <FaSpinner className="animate-spin" /> AI đang xử lý...
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium line-clamp-3 text-gray-800">
                    {item.rawContent}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cột phải: Form xem & chỉnh sửa dữ liệu đã bóc tách */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-gray-200 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="font-bold text-gray-800">
              Form Bóc Tách (Đồng bộ vào DB)
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleReject}
                disabled={!selectedJob || isSubmitting}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium disabled:opacity-50"
              >
                <FaTrash /> Từ chối
              </button>
              <button
                onClick={handleApprove}
                disabled={!selectedJob || isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium disabled:opacity-50"
              >
                {isSubmitting ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaCheck />
                )}
                Phê duyệt & Lưu
              </button>
            </div>
          </div>

          {!selectedJob ? (
            <div className="py-16 text-center text-gray-400">
              Chọn một bài đăng ở danh sách bên trái để xem form bóc tách.
            </div>
          ) : (
            <>
              {isSelectedStillProcessing && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-3 py-2 flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  AI đang bóc tách bài đăng này, form sẽ tự động điền khi có kết
                  quả (danh sách tự làm mới mỗi 5 giây). Bạn vẫn có thể tự điền
                  tay ngay bây giờ nếu muốn.
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="col-span-2">
                  <label className="block font-medium text-gray-700 mb-1">
                    Tiêu đề vị trí (jobTitle) *
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Công ty (companyName)
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Ngành nghề (category)
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Email HR (hrEmail)
                  </label>
                  <input
                    type="email"
                    name="hrEmail"
                    value={formData.hrEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    SĐT/Zalo (contactPhone)
                  </label>
                  <input
                    type="text"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-medium text-gray-700 mb-1">
                    Địa điểm làm việc (location)
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-medium text-gray-700 mb-1">
                    Yêu cầu & Quyền lợi (requirements / benefits)
                  </label>
                  <textarea
                    name="requirements"
                    rows="3"
                    value={formData.requirements}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg mb-2"
                    placeholder="Yêu cầu..."
                  ></textarea>
                  <textarea
                    name="benefits"
                    rows="3"
                    value={formData.benefits}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Quyền lợi..."
                  ></textarea>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

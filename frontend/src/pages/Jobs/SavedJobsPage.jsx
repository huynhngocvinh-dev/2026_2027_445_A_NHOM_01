import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { jobApi } from "../../api/jobApi";
import { ApiError } from "../../lib/apiClient";
import JobCard from "../../components/job/JobCard";
import JobDetailModal from "../../components/job/JobDetailModal";

/**
 * Danh sách việc làm đã lưu của người dùng hiện tại (GET /api/saved-jobs)
 */
function SavedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const loadSavedJobs = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError("");
    try {
      const data = await jobApi.getSavedJobs();
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      setLoadError(
        error instanceof ApiError
          ? error.message
          : "Không thể tải danh sách việc làm đã lưu."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSavedJobs();
  }, []);

  // Xử lý bỏ lưu công việc (Unsave)
  const handleUnsave = async (job) => {
    try {
      await jobApi.toggleSaveJob(job.id);
      // Cập nhật state xóa job khỏi màn hình danh sách ngay lập tức
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
      toast.success("Đã bỏ lưu tin tuyển dụng.");

      // Nếu đang mở modal mà bỏ lưu thì đóng modal
      if (selectedJob?.id === job.id) {
        setSelectedJob(null);
      }
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Không thể bỏ lưu tin. Vui lòng thử lại."
      );
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-4xl py-12 text-center">
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10">
          <h2 className="text-lg font-bold text-gray-900">
            Bạn chưa đăng nhập
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Vui lòng đăng nhập tài khoản ứng viên để xem danh sách việc làm đã
            lưu.
          </p>
          <Link
            to="/login"
            className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">
      <h1 className="text-xl font-bold text-gray-900">Việc làm đã lưu</h1>
      <p className="mt-1 text-sm text-gray-500">
        Danh sách các tin tuyển dụng bạn đã lưu để xem và ứng tuyển sau.
      </p>

      <div className="mt-6">
        {isLoading ? (
          <div className="rounded-2xl bg-white p-10 text-center border border-gray-100">
            <p className="text-sm text-gray-400">
              Đang tải danh sách đã lưu...
            </p>
          </div>
        ) : loadError ? (
          <div className="rounded-2xl bg-white p-10 text-center border border-gray-100">
            <p className="text-sm font-medium text-red-500">{loadError}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <p className="text-base font-bold text-gray-900">
              Bạn chưa lưu tin tuyển dụng nào
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Nhấn biểu tượng lưu trên các bài viết để lưu lại các cơ hội việc
              làm hấp dẫn.
            </p>
            <Link
              to="/jobs"
              className="mt-4 inline-block text-xs font-semibold text-blue-600 hover:underline"
            >
              Khám phá việc làm ngay →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                saved={true} // Tất cả các job trong trang này đều đang được lưu
                onToggleSave={handleUnsave}
                onClickCard={(j) => setSelectedJob(j)}
                onApply={(j) => setSelectedJob(j)}
              />
            ))}
          </div>
        )}
      </div>

      {/* POPUP XEM CHI TIẾT CÔNG VIỆC */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          saved={true}
          onToggleSave={handleUnsave}
        />
      )}
    </div>
  );
}

export default SavedJobsPage;

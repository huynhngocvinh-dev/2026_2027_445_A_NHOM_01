import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jobApi } from "../../api/jobApi";
import { ApiError } from "../../lib/apiClient";
import JobCard from "../../components/job/JobCard";

/**
 * Danh sách việc làm đã lưu của người dùng hiện tại (GET /jobs/saved).
 */
function SavedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadSavedJobs = () => {
    (async () => {
      setIsLoading(true);
      try {
        const data = await jobApi.getSavedJobs();
        setJobs(data);
      } catch (error) {
        setLoadError(error instanceof ApiError ? error.message : "Không thể tải danh sách đã lưu.");
      } finally {
        setIsLoading(false);
      }
    })();
  };

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const handleUnsave = async (job) => {
    try {
      await jobApi.unsaveJob(job.id);
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
      toast.success("Đã bỏ lưu tin.");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Không thể bỏ lưu tin. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <h1 className="text-lg font-bold text-gray-900">Việc làm đã lưu</h1>
      <p className="mt-1 text-sm text-gray-500">Danh sách các tin tuyển dụng bạn đã lưu để xem sau.</p>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-gray-400">Đang tải...</p>
        ) : loadError ? (
          <p className="text-sm text-red-500">{loadError}</p>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center">
            <p className="text-sm font-semibold text-gray-900">Bạn chưa lưu tin nào</p>
            <p className="mt-1 text-xs text-gray-400">Nhấn biểu tượng lưu trên mỗi tin để thêm vào đây.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} saved onToggleSave={handleUnsave} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedJobsPage;

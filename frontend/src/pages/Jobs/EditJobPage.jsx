import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { jobApi } from "../../api/jobApi";
import { ApiError } from "../../lib/apiClient";
import JobForm from "../../components/job/JobForm";

function EditJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    jobApi
      .getJobById(id)
      .then(setJob)
      .catch((error) => setLoadError(error instanceof ApiError ? error.message : "Không tìm thấy tin tuyển dụng."))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      await jobApi.updateJob(id, values);
      toast.success("Cập nhật tin tuyển dụng thành công!");
      navigate("/jobs");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  if (isLoading) return <p className="text-sm text-gray-400">Đang tải...</p>;
  if (loadError) return <p className="text-sm text-red-500">{loadError}</p>;

  return (
    <div>
      <h1 className="text-lg font-bold text-gray-900">Chỉnh sửa tin tuyển dụng</h1>
      <p className="mt-1 text-sm text-gray-500">Cập nhật thông tin cho tin tuyển dụng của bạn.</p>
      <div className="mt-6">
        <JobForm initialValues={job} onSubmit={handleSubmit} submitLabel="Lưu thay đổi" />
      </div>
    </div>
  );
}

export default EditJobPage;

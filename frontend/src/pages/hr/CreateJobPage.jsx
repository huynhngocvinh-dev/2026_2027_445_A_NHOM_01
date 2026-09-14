// Đăng tin tuyển dụng
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jobApi } from "../../api/jobApi";
import { ApiError } from "../../lib/apiClient";
import JobForm from "../../components/job/JobForm";

function CreateJobPage() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await jobApi.createJob(values);
      toast.success("Đăng tin tuyển dụng thành công!");
      navigate("/jobs");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Đăng tin thất bại. Vui lòng thử lại.",
      );
    }
  };

  return (
    <div>
      <h1 className="text-lg font-bold text-gray-900">Đăng tin tuyển dụng</h1>
      <p className="mt-1 text-sm text-gray-500">
        Điền thông tin chi tiết để đăng tin tuyển dụng mới.
      </p>
      <div className="mt-6">
        <JobForm onSubmit={handleSubmit} submitLabel="Đăng tin" />
      </div>
    </div>
  );
}

export default CreateJobPage;

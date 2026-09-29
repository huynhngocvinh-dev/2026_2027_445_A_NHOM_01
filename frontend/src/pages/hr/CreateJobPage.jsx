import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jobApi } from "../../api/jobApi";
import { ApiError } from "../../lib/apiClient";
import JobForm from "../../components/job/JobForm";

function CreateJobPage() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      // 1. Tách chuỗi mức lương (ví dụ: "20 - 30 triệu") thành minSalary & maxSalary
      let minSalary = 0;
      let maxSalary = 0;
      if (values.salary) {
        const numbers = values.salary.match(/\d+/g); // Trích xuất tất cả số trong chuỗi
        if (numbers && numbers.length >= 2) {
          minSalary = parseInt(numbers[0], 10);
          maxSalary = parseInt(numbers[1], 10);
        } else if (numbers && numbers.length === 1) {
          minSalary = parseInt(numbers[0], 10);
          maxSalary = parseInt(numbers[0], 10);
        }
      }

      // 2. Lấy email của HR đăng nhập hiện tại từ LocalStorage / Auth Context
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      const hrEmail = userObj.email || "hr@company.com";

      // 3. Chuẩn hóa Payload đúng tên thuộc tính mà Spring Boot JobController chờ nhận
      const payload = {
        jobTitle: values.title,
        companyName: values.company,
        location: values.location,
        minSalary: minSalary,
        maxSalary: maxSalary,
        jobType: values.type,
        category: values.category,
        description: values.description,
        status: "PUBLISHED",
        hrEmail: hrEmail,
      };

      await jobApi.createJob(payload);
      toast.success("Đăng tin tuyển dụng thành công!");
      navigate("/jobs");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Đăng tin thất bại. Vui lòng thử lại."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900">Đăng tin tuyển dụng</h1>
      <p className="mt-1 text-sm text-gray-500">
        Điền thông tin chi tiết để đăng tin tuyển dụng mới lên hệ thống.
      </p>
      <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <JobForm onSubmit={handleSubmit} submitLabel="Đăng tin" />
      </div>
    </div>
  );
}

export default CreateJobPage;

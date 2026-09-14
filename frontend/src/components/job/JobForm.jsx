import { useState } from "react";
import FormField from "../form/FormField";

const JOB_TYPES = ["Toàn thời gian", "Bán thời gian", "Remote", "Thực tập"];
const CATEGORIES = ["IT / Phần mềm", "Marketing", "Sales", "Thiết kế", "Tài chính", "Nhân sự"];

/**
 * Form đăng/sửa tin tuyển dụng - dùng chung cho CreateJobPage và EditJobPage
 * để không phải viết 2 form gần như giống hệt nhau.
 *
 * props:
 * - initialValues: giá trị ban đầu (rỗng khi tạo mới, dữ liệu tin khi sửa)
 * - onSubmit: (values) => Promise<void>
 * - submitLabel: chữ trên nút submit
 */
function JobForm({ initialValues, onSubmit, submitLabel = "Đăng tin" }) {
  const [values, setValues] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: JOB_TYPES[0],
    category: CATEGORIES[0],
    description: "",
    ...initialValues,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!values.title.trim()) newErrors.title = "Vui lòng nhập chức danh công việc";
    if (!values.company.trim()) newErrors.company = "Vui lòng nhập tên công ty";
    if (!values.location.trim()) newErrors.location = "Vui lòng nhập địa điểm làm việc";
    if (!values.salary.trim()) newErrors.salary = "Vui lòng nhập mức lương";
    if (!values.description.trim() || values.description.trim().length < 30) {
      newErrors.description = "Mô tả công việc cần ít nhất 30 ký tự";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <FormField
        label="Chức danh công việc"
        name="title"
        value={values.title}
        onChange={handleChange}
        placeholder="VD: Senior Frontend Developer"
        error={errors.title}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Tên công ty"
          name="company"
          value={values.company}
          onChange={handleChange}
          error={errors.company}
        />
        <FormField
          label="Địa điểm"
          name="location"
          value={values.location}
          onChange={handleChange}
          placeholder="VD: Hồ Chí Minh"
          error={errors.location}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          label="Mức lương"
          name="salary"
          value={values.salary}
          onChange={handleChange}
          placeholder="VD: 20 - 30 triệu"
          error={errors.salary}
        />

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Hình thức</label>
          <select
            name="type"
            value={values.type}
            onChange={handleChange}
            className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Ngành nghề</label>
          <select
            name="category"
            value={values.category}
            onChange={handleChange}
            className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Mô tả công việc</label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          rows={6}
          placeholder="Mô tả chi tiết công việc, yêu cầu, quyền lợi..."
          className={`w-full rounded-lg border bg-white p-3 text-sm outline-none transition ${
            errors.description
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          }`}
        />
        {errors.description && <p className="mt-1 text-xs text-red-500 font-medium">{errors.description}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 px-6 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition disabled:opacity-60"
      >
        {isSubmitting ? "Đang xử lý..." : submitLabel}
      </button>
    </form>
  );
}

export default JobForm;

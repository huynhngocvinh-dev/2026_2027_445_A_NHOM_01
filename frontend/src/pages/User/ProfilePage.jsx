import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiAward,
  FiFileText,
  FiUploadCloud,
  FiCheckCircle,
  FiTrash2,
  FiEye,
  FiDownload,
  FiLink,
} from "react-icons/fi";
import { authApi } from "../../api/authApi";
import { ApiError } from "../../lib/apiClient";
import { useAuth } from "../../hooks/useAuth";
import FormField from "../../components/form/FormField";

function ProfilePage() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    location: "",
    title: "",
    level: "Fresher / Junior",
    experience: "",
    salaryExpectation: "",
    workType: "Toàn thời gian",
    jobStatus: "Đang tìm việc",
    skills: "",
    bio: "",
    github: "",
    linkedin: "",
    portfolio: "",
    cvList: [],
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    authApi
      .me()
      .then((data) => {
        if (data) {
          setFormData((prev) => ({
            ...prev,
            fullName: data.fullName || "",
            phoneNumber: data.phoneNumber || "",
            location: data.location || "",
            title: data.title || "",
            level: data.level || "Fresher / Junior",
            experience: data.experience || "",
            salaryExpectation: data.salaryExpectation || "",
            workType: data.workType || "Toàn thời gian",
            jobStatus: data.jobStatus || "Đang tìm việc",
            skills: data.skills || "",
            bio: data.bio || "",
            github: data.github || "",
            linkedin: data.linkedin || "",
            portfolio: data.portfolio || "",
            cvList: data.cvList || [],
          }));
        }
      })
      .catch(() => toast.error("Không thể tải thông tin hồ sơ từ máy chủ."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleUploadCV = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (
        file.type !== "application/pdf" &&
        !file.name.endsWith(".doc") &&
        !file.name.endsWith(".docx")
      ) {
        toast.error("Chỉ hỗ trợ định dạng file PDF hoặc Word!");
        return;
      }
      const newCv = {
        id: Date.now(),
        name: file.name,
        isPrimary: formData.cvList.length === 0,
      };
      setFormData((prev) => ({ ...prev, cvList: [...prev.cvList, newCv] }));
      toast.success(`Đã tải lên CV: ${file.name}`);
    }
  };

  const handleSetPrimaryCV = (id) => {
    setFormData((prev) => ({
      ...prev,
      cvList: prev.cvList.map((cv) => ({ ...cv, isPrimary: cv.id === id })),
    }));
    toast.success("Đã đặt làm CV chính!");
  };

  const handleDeleteCV = (id) => {
    setFormData((prev) => ({
      ...prev,
      cvList: prev.cvList.filter((cv) => cv.id !== id),
    }));
    toast.success("Đã xóa CV.");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim())
      newErrors.fullName = "Vui lòng nhập họ và tên";
    if (
      formData.phoneNumber &&
      !/^(0|\+84)[0-9]{9,10}$/.test(formData.phoneNumber)
    ) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSaving(true);
      await authApi.updateProfile(formData);
      toast.success("Đã lưu thay đổi hồ sơ vào database thành công!");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Lưu thất bại. Vui lòng kiểm tra lại kết nối.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <p className="text-sm text-gray-400">
        Đang tải hồ sơ từ cơ sở dữ liệu...
      </p>
    );
  }

  return (
    <div className="max-w-4xl pb-16">
      <h1 className="text-xl font-bold text-gray-900">Hồ sơ ứng viên</h1>
      <p className="mt-1 text-sm text-gray-500">
        Quản lý thông tin cá nhân và lưu trữ dữ liệu trực tiếp vào hệ thống.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* 👤 1. Thông tin cá nhân */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
            <FiUser /> 1. Thông tin cá nhân
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Họ tên"
              icon={<FiUser />}
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên..."
              error={errors.fullName}
            />
            <FormField
              label="Email đăng nhập"
              icon={<FiMail />}
              value={user?.email || ""}
              disabled
              className="opacity-70 bg-gray-50"
            />
            <FormField
              label="Số điện thoại"
              icon={<FiPhone />}
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Nhập số điện thoại..."
              error={errors.phoneNumber}
            />
            <FormField
              label="Địa điểm (Thành phố)"
              icon={<FiMapPin />}
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ví dụ: Đà Nẵng, TP.HCM..."
            />
          </div>
        </div>

        {/* 💼 2. Thông tin nghề nghiệp */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
            <FiBriefcase /> 2. Thông tin nghề nghiệp
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Vị trí mong muốn"
              icon={<FiBriefcase />}
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ví dụ: Software Engineer, Tester..."
            />
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Cấp bậc mong muốn
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:border-blue-600"
              >
                <option value="Intern">Intern / Thực tập sinh</option>
                <option value="Fresher / Junior">Fresher / Junior</option>
                <option value="Middle">Middle</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Kinh nghiệm làm việc
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Ví dụ: Chưa có, 1 năm, 2 năm..."
                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Mức lương mong muốn
              </label>
              <input
                type="text"
                name="salaryExpectation"
                value={formData.salaryExpectation}
                onChange={handleChange}
                placeholder="Ví dụ: 10 - 15 triệu, Thỏa thuận..."
                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Hình thức làm việc
              </label>
              <select
                name="workType"
                value={formData.workType}
                onChange={handleChange}
                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:border-blue-600"
              >
                <option value="Toàn thời gian">
                  Toàn thời gian (Full-time)
                </option>
                <option value="Bán thời gian">Bán thời gian (Part-time)</option>
                <option value="Thực tập">Thực tập (Internship)</option>
                <option value="Remote">Làm từ xa (Remote)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Trạng thái tìm việc
              </label>
              <select
                name="jobStatus"
                value={formData.jobStatus}
                onChange={handleChange}
                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:border-blue-600"
              >
                <option value="Đang tìm việc">Đang tích cực tìm việc</option>
                <option value="Cân nhắc cơ hội">
                  Đang cân nhắc cơ hội phù hợp
                </option>
                <option value="Không tìm việc">Không tìm việc lúc này</option>
              </select>
            </div>
          </div>
        </div>

        {/* 🛠️ 3. Kỹ năng & giới thiệu */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
            <FiAward /> 3. Kỹ năng & giới thiệu
          </h2>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Kỹ năng chuyên môn
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Ví dụ: ReactJS, Spring Boot, Java, SQL..."
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Giới thiệu bản thân (Bio)
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Chia sẻ ngắn gọn về định hướng nghề nghiệp và điểm mạnh..."
              className="w-full text-sm border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="GitHub"
              icon={<FiLink />}
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/..."
            />
            <FormField
              label="LinkedIn"
              icon={<FiLink />}
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
            />
            <FormField
              label="Portfolio / Website cá nhân"
              icon={<FiLink />}
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              placeholder="https://yourportfolio.dev"
            />
          </div>
        </div>

        {/* 📄 4. Quản lý CV */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
            <FiFileText /> 4. Quản lý CV ứng tuyển
          </h2>

          <div className="border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-2xl p-6 text-center transition hover:bg-blue-50">
            <input
              type="file"
              id="cv-file-input"
              accept=".pdf,.doc,.docx"
              onChange={handleUploadCV}
              className="hidden"
            />
            <label
              htmlFor="cv-file-input"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 shadow-sm">
                <FiUploadCloud size={22} />
              </div>
              <p className="text-sm font-semibold text-gray-800">
                Tải lên CV mới (PDF, DOC, DOCX)
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Tối đa 5MB mỗi file
              </p>
            </label>
          </div>

          <div className="mt-4 space-y-3">
            <h3 className="text-xs font-semibold text-gray-700 uppercase">
              Danh sách CV đã tải lên
            </h3>
            {formData.cvList.length === 0 ? (
              <p className="text-xs text-gray-400 italic">
                Chưa có CV nào trong cơ sở dữ liệu. Vui lòng tải lên CV.
              </p>
            ) : (
              formData.cvList.map((cv) => (
                <div
                  key={cv.id}
                  className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                      <FiFileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {cv.name}
                      </p>
                      {cv.isPrimary ? (
                        <span className="text-[11px] text-green-600 font-medium flex items-center gap-1">
                          <FiCheckCircle size={11} /> CV chính đang sử dụng
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-400">
                          CV phụ
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => alert(`Xem trước: ${cv.name}`)}
                      className="p-2 text-gray-500 hover:text-blue-600 transition"
                      title="Xem CV"
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Tải xuống: ${cv.name}`)}
                      className="p-2 text-gray-500 hover:text-blue-600 transition"
                      title="Tải CV"
                    >
                      <FiDownload size={16} />
                    </button>
                    {!cv.isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryCV(cv.id)}
                        className="px-2.5 py-1 text-xs bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition"
                      >
                        Đặt chính
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteCV(cv.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition"
                      title="Xóa CV"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* NÚT LƯU THAY ĐỔI Ở CUỐI TRANG */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSaving}
            className="h-12 px-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-bold shadow-lg shadow-blue-500/25 transition disabled:opacity-60 cursor-pointer"
          >
            {isSaving ? "Đang lưu..." : "[ Lưu thay đổi hồ sơ ]"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;

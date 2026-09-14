import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";
import { authApi } from "../../api/authApi";
import { ApiError } from "../../lib/apiClient";
import { useAuth } from "../../hooks/useAuth";
import FormField from "../../components/form/FormField";

/**
 * Trang hồ sơ cá nhân: xem + cập nhật họ tên/số điện thoại.
 * Email không cho sửa (là định danh đăng nhập).
 */
function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ fullName: "", phoneNumber: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    authApi
      .me()
      .then((data) =>
        setFormData({ fullName: data.fullName || "", phoneNumber: data.phoneNumber || "" })
      )
      .catch(() => toast.error("Không thể tải thông tin hồ sơ."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên";
    if (formData.phoneNumber && !/^(0|\+84)[0-9]{9,10}$/.test(formData.phoneNumber)) {
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
      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-gray-400">Đang tải hồ sơ...</p>;
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-lg font-bold text-gray-900">Hồ sơ của tôi</h1>
      <p className="mt-1 text-sm text-gray-500">Cập nhật thông tin cá nhân của bạn.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <FormField
          label="Email"
          icon={<FiMail />}
          value={user?.email || ""}
          disabled
          className="opacity-70"
        />
        <FormField
          label="Họ và tên"
          icon={<FiUser />}
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />
        <FormField
          label="Số điện thoại"
          icon={<FiPhone />}
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="0901234567"
          error={errors.phoneNumber}
        />

        <button
          type="submit"
          disabled={isSaving}
          className="h-11 px-6 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition disabled:opacity-60"
        >
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;

import { useState, useEffect } from "react";
import {
  FiEdit3,
  FiSave,
  FiCheckCircle,
  FiImage,
  FiBriefcase,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "http://localhost:8080/api/v1/company";

function CompanyInfoPage() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hrUserId, setHrUserId] = useState(null);

  const [company, setCompany] = useState({
    name: "",
    industry: "",
    employees: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    description: "",
    isVerified: false,
    images: [],
    totalJobs: 0,
    totalCandidates: 0,
    totalViews: 0,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Kiểm tra xem ID lưu ở trường 'id' hay 'userId'
        const currentId = parsedUser.id || parsedUser.userId;
        setHrUserId(currentId);
        if (currentId) {
          fetchCompanyInfo(currentId);
        }
      } catch (error) {
        console.error("Lỗi parse user:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCompanyInfo = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE_URL, {
        headers: { "X-HR-User-Id": id },
      });
      if (res.ok) {
        const data = await res.json();
        setCompany({
          name: data.name || "",
          industry: data.industry || "",
          employees: data.employees || "",
          email: data.email || "",
          phone: data.phone || "",
          website: data.website || "",
          address: data.address || "",
          description: data.description || "",
          isVerified: !!data.isVerified,
          images: data.images || [],
          totalJobs: data.totalJobs || 0,
          totalCandidates: data.totalCandidates || 0,
          totalViews: data.totalViews || 0,
        });

        if (!data.name) {
          setEditing(true);
        }
      }
    } catch (error) {
      toast.error("Không thể tải thông tin công ty!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompany((prev) => ({
          ...prev,
          images: [...(prev.images || []), reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Logic Xóa Ảnh khỏi danh sách
  const handleRemoveImage = (indexToRemove) => {
    setCompany((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSave = async () => {
    if (!hrUserId) {
      toast.error("Không tìm thấy thông tin tài khoản HR!");
      return;
    }
    try {
      setSaving(true);
      const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-HR-User-Id": hrUserId,
        },
        body: JSON.stringify(company),
      });

      if (res.ok) {
        const updated = await res.json();
        setCompany((prev) => ({ ...prev, ...updated }));
        setEditing(false);
        toast.success("Lưu thông tin công ty thành công!");
      } else {
        toast.error("Lưu thông tin thất bại!");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi kết nối máy chủ!");
    } finally {
      setSaving(false);
    }
  };

  const getLogoText = (name) => {
    if (!name) return "CO";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-52px)] bg-slate-50 p-5">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* TITLE */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-950">Thông tin công ty</h1>

        {editing ? (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <FiSave />
            {saving ? "Đang lưu..." : "Lưu thông tin"}
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <FiEdit3 />
            Chỉnh sửa
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_440px]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            {/* COMPANY HEADER */}
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-xl font-bold text-white">
                {getLogoText(company.name)}
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  {company.name || "Tên công ty chưa cập nhật"}
                </h2>

                <p className="text-sm text-slate-500">
                  {company.industry || "Nghành nghề"} ·{" "}
                  {company.employees || "Quy mô"}
                </p>

                {company.isVerified ? (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600">
                    <FiCheckCircle /> Đã xác minh
                  </span>
                ) : (
                  <span className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                    Chưa xác minh
                  </span>
                )}
              </div>
            </div>

            {/* FORM */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-slate-600">
                  Tên công ty
                </label>
                <input
                  name="name"
                  value={company.name}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Nhập tên công ty..."
                  className="h-9 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-600">
                  Lĩnh vực hoạt động
                </label>
                <input
                  name="industry"
                  value={company.industry}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Ví dụ: Công nghệ thông tin"
                  className="h-9 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-600">
                  Quy mô nhân sự
                </label>
                <input
                  name="employees"
                  value={company.employees}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Ví dụ: 100-500 nhân viên"
                  className="h-9 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-600">
                  Email HR
                </label>
                <input
                  name="email"
                  value={company.email}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="hr@company.com"
                  className="h-9 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-600">
                  Số điện thoại
                </label>
                <input
                  name="phone"
                  value={company.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="024xxxxxxx"
                  className="h-9 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-600">
                  Website
                </label>
                <input
                  name="website"
                  value={company.website}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="company.com"
                  className="h-9 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-xs text-slate-600">
                  Địa chỉ
                </label>
                <input
                  name="address"
                  value={company.address}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Nhập địa chỉ trụ sở chính..."
                  className="h-9 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-xs text-slate-600">
                  Mô tả công ty
                </label>
                <textarea
                  name="description"
                  value={company.description}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Giới thiệu tổng quan về công ty..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* COMPANY IMAGES (ĐÃ CẬP NHẬT DYNAMIC UPLOAD) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold">Hình ảnh công ty</h2>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {/* Nút Upload file (chỉ hiện khi bật chế độ Edit) */}
              {editing && (
                <label className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-slate-50">
                  <FiUploadCloud className="text-xl text-slate-400" />
                  <span className="mt-1 text-xs text-slate-500">
                    Tải ảnh lên
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}

              {/* Danh sách ảnh đã chọn/lưu */}
              {company.images && company.images.length > 0
                ? company.images.map((imgUrl, index) => (
                    <div
                      key={index}
                      className="relative group h-24 overflow-hidden rounded-2xl border border-slate-200"
                    >
                      <img
                        src={imgUrl}
                        alt={`Company ${index}`}
                        className="h-full w-full object-cover"
                      />
                      {editing && (
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <FiX size={14} />
                        </button>
                      )}
                    </div>
                  ))
                : !editing && (
                    <div className="col-span-2 text-xs text-slate-400">
                      Chưa có hình ảnh nào được cập nhật.
                    </div>
                  )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        {/* RIGHT SIDEBAR */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold text-slate-900">Thống kê</h2>
            <div className="divide-y divide-slate-100">
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500">Tin tuyển dụng</span>
                <strong className="text-slate-900">{company.totalJobs}</strong>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500">Ứng viên</span>
                <strong className="text-slate-900">
                  {company.totalCandidates}
                </strong>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500">Lượt xem hồ sơ</span>
                <strong className="text-slate-900">{company.totalViews}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyInfoPage;

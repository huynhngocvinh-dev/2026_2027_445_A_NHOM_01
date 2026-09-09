import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

function CreateJobPage() {
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "FPT Software",
    hrEmail: "hr@fpt.com.vn",
    description: "",
    requirements: "",
    benefits: "",
    minSalary: "",
    maxSalary: "",
    location: "",
    jobType: "",
    experience: "",
    companyImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE IMAGE
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Chỉ cho phép hình ảnh
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh!");
      return;
    }

    // Giới hạn 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Hình ảnh không được vượt quá 5MB!");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      companyImage: file,
    }));
  };

  // =========================
  // VALIDATE
  // =========================
  const validateForm = () => {
    if (!formData.jobTitle.trim()) {
      alert("Vui lòng nhập tên công việc!");
      return false;
    }

    if (!formData.companyName.trim()) {
      alert("Vui lòng nhập tên công ty!");
      return false;
    }

    if (!formData.hrEmail.trim()) {
      alert("Vui lòng nhập Email HR!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.hrEmail.trim())) {
      alert("Email HR không hợp lệ!");
      return false;
    }

    if (!formData.description.trim()) {
      alert("Vui lòng nhập mô tả công việc!");
      return false;
    }

    if (!formData.requirements.trim()) {
      alert("Vui lòng nhập yêu cầu ứng viên!");
      return false;
    }

    if (!formData.location.trim()) {
      alert("Vui lòng nhập địa điểm!");
      return false;
    }

    if (!formData.jobType) {
      alert("Vui lòng chọn loại công việc!");
      return false;
    }

    if (
      formData.minSalary !== "" &&
      Number(formData.minSalary) < 0
    ) {
      alert("Mức lương tối thiểu không hợp lệ!");
      return false;
    }

    if (
      formData.maxSalary !== "" &&
      Number(formData.maxSalary) < 0
    ) {
      alert("Mức lương tối đa không hợp lệ!");
      return false;
    }

    if (
      formData.minSalary !== "" &&
      formData.maxSalary !== "" &&
      Number(formData.minSalary) > Number(formData.maxSalary)
    ) {
      alert("Mức lương tối thiểu không được lớn hơn mức lương tối đa!");
      return false;
    }

    return true;
  };

  // =========================
  // CREATE JSON PAYLOAD
  // =========================
  const createPayload = () => {
    return {
      jobTitle: formData.jobTitle.trim(),
      companyName: formData.companyName.trim(),
      hrEmail: formData.hrEmail.trim(),
      description: formData.description.trim(),
      requirements: formData.requirements.trim(),
      benefits: formData.benefits.trim(),

      minSalary:
        formData.minSalary === ""
          ? null
          : Number(formData.minSalary),

      maxSalary:
        formData.maxSalary === ""
          ? null
          : Number(formData.maxSalary),

      location: formData.location.trim(),
      jobType: formData.jobType,
      experience: formData.experience,

      // Nếu Backend xử lý upload ảnh riêng,
      // file này sẽ được gửi qua API upload riêng.
      companyImageName: formData.companyImage
        ? formData.companyImage.name
        : null,
    };
  };

  // =========================
  // POST CREATE JOB
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = createPayload();

    console.log("=================================");
    console.log("📤 DỮ LIỆU TẠO BÀI ĐĂNG");
    console.log("=================================");
    console.log(JSON.stringify(payload, null, 2));

    console.log("🌐 API:", `${API_URL}/api/jobs`);

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log("📥 RESPONSE BACKEND:");
      console.log(data);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Đăng tin thất bại. HTTP ${response.status}`
        );
      }

      alert("Đăng tin tuyển dụng thành công!");

      // Reset form
      setFormData({
        jobTitle: "",
        companyName: "FPT Software",
        hrEmail: "hr@fpt.com.vn",
        description: "",
        requirements: "",
        benefits: "",
        minSalary: "",
        maxSalary: "",
        location: "",
        jobType: "",
        experience: "",
        companyImage: null,
      });
    } catch (error) {
      console.error("❌ LỖI ĐĂNG TIN:");
      console.error(error);

      if (error instanceof TypeError) {
        alert(
          "Không thể kết nối đến Backend!\n\n" +
            "Kiểm tra:\n" +
            "1. Backend đã chạy chưa?\n" +
            "2. Backend có chạy port 8080 không?\n" +
            "3. API /api/jobs có tồn tại không?\n" +
            "4. Backend đã cấu hình CORS chưa?"
        );
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SAVE DRAFT
  // =========================
  const handleSaveDraft = async () => {
    const payload = createPayload();

    console.log("=================================");
    console.log("💾 LƯU BẢN NHÁP");
    console.log("=================================");
    console.log(JSON.stringify(payload, null, 2));

    setDraftLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/jobs/draft`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log("📥 RESPONSE BACKEND:");
      console.log(data);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Lưu bản nháp thất bại. HTTP ${response.status}`
        );
      }

      alert("Đã lưu bản nháp thành công!");
    } catch (error) {
      console.error("❌ LỖI LƯU BẢN NHÁP:");
      console.error(error);

      if (error instanceof TypeError) {
        alert("Không thể kết nối đến Backend!");
      } else {
        alert(error.message);
      }
    } finally {
      setDraftLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =========================================
          HEADER
      ========================================= */}
      <header className="fixed left-60 right-0 top-0 z-30 h-14 border-b border-slate-200 bg-white">
        <div className="flex h-full items-center justify-end px-6">
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M15 17h5l-1.5-1.5V11a6.5 6.5 0 00-5-6.3V4a1 1 0 10-2 0v.7A6.5 6.5 0 005.5 11v4.5L4 17h5m6 0v1a3 3 0 01-6 0v-1"
              />
            </svg>

            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </div>
      </header>

      {/* =========================================
          SIDEBAR
      ========================================= */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-slate-950 text-white">
        {/* Logo */}
        <div className="border-b border-slate-800 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-9 0h10a3 3 0 013 3v7a3 3 0 01-3 3H7a3 3 0 01-3-3v-7a3 3 0 013-3z"
                />
              </svg>
            </div>

            <span className="text-lg font-bold">
              JobFinder
            </span>
          </div>

          <p className="mt-1 text-xs text-blue-300">
            Nhà tuyển dụng
          </p>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4">
          <SidebarItem icon="home" text="Dashboard" />

          <SidebarItem
            icon="building"
            text="Thông tin công ty"
          />

          <SidebarItem
            icon="plus"
            text="Đăng tin tuyển dụng"
            active
          />

          <SidebarItem
            icon="clipboard"
            text="Tin tuyển dụng"
          />

          <SidebarItem
            icon="users"
            text="Ứng viên"
          />

          <SidebarItem
            icon="file"
            text="Ứng tuyển"
          />
        </nav>

        {/* Company */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-xs font-bold">
              FP
            </div>

            <div>
              <p className="text-sm font-semibold">
                FPT Software
              </p>

              <p className="text-xs text-slate-400">
                hr@fpt.com.vn
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* =========================================
          MAIN
      ========================================= */}
      <main className="ml-60 pt-14">
        <div className="px-6 py-7">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-950">
              Đăng tin tuyển dụng
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Tạo bài đăng mới để tìm kiếm ứng viên phù hợp
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_405px]">
              {/* =====================================
                  LEFT
              ===================================== */}
              <div className="space-y-5">
                {/* =====================================
                    THÔNG TIN CƠ BẢN
                ===================================== */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="mb-6 text-base font-bold text-slate-900">
                    Thông tin cơ bản
                  </h2>

                  {/* Job title */}
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-slate-800">
                      Tên công việc{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="ví dụ: Java Backend Developer"
                      className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Company + HR */}
                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-800">
                        Tên công ty
                      </label>

                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-800">
                        Email HR
                      </label>

                      <input
                        type="email"
                        name="hrEmail"
                        value={formData.hrEmail}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-slate-800">
                      Mô tả công việc{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Mô tả chi tiết về vị trí này..."
                      className="w-full resize-none rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Requirements */}
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-slate-800">
                      Yêu cầu ứng viên{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Kinh nghiệm, kỹ năng, trình độ học vấn..."
                      className="w-full resize-none rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Benefits */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-800">
                      Quyền lợi
                    </label>

                    <textarea
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Phúc lợi, chế độ làm việc, cơ hội phát triển..."
                      className="w-full resize-none rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </section>

                {/* =====================================
                    ĐIỀU KIỆN LÀM VIỆC
                ===================================== */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="mb-6 text-base font-bold text-slate-900">
                    Điều kiện làm việc
                  </h2>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Min salary */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-800">
                        Mức lương tối thiểu (triệu)
                      </label>

                      <input
                        type="number"
                        min="0"
                        name="minSalary"
                        value={formData.minSalary}
                        onChange={handleChange}
                        placeholder="ví dụ: 20"
                        className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* Max salary */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-800">
                        Mức lương tối đa (triệu)
                      </label>

                      <input
                        type="number"
                        min="0"
                        name="maxSalary"
                        value={formData.maxSalary}
                        onChange={handleChange}
                        placeholder="ví dụ: 35"
                        className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-800">
                        Địa điểm{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="ví dụ: Hà Nội"
                        className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* Job type */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-800">
                        Loại công việc{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <select
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">
                          Chọn loại
                        </option>

                        <option value="full-time">
                          Full-time
                        </option>

                        <option value="part-time">
                          Part-time
                        </option>

                        <option value="remote">
                          Remote
                        </option>

                        <option value="hybrid">
                          Hybrid
                        </option>

                        <option value="internship">
                          Internship
                        </option>
                      </select>
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-800">
                        Kinh nghiệm yêu cầu
                      </label>

                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">
                          Chọn kinh nghiệm
                        </option>

                        <option value="no-experience">
                          Chưa có kinh nghiệm
                        </option>

                        <option value="1-3">
                          1 - 3 năm
                        </option>

                        <option value="3-5">
                          3 - 5 năm
                        </option>

                        <option value="5+">
                          Trên 5 năm
                        </option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* =====================================
                    IMAGE
                ===================================== */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="mb-6 text-base font-bold text-slate-900">
                    Hình ảnh công ty{" "}
                    <span className="font-normal text-slate-500">
                      (tùy chọn)
                    </span>
                  </h2>

                  <label
                    htmlFor="companyImage"
                    className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 transition hover:border-blue-400 hover:bg-blue-50"
                  >
                    <svg
                      className="mb-3 h-7 w-7 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.6"
                        d="M4 16l4.5-4.5a2 2 0 012.8 0L16 16m-3-3l1.5-1.5a2 2 0 012.8 0L20 14m-9-7h.01M5 20h14a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v14a1 1 0 001 1z"
                      />
                    </svg>

                    <span className="px-4 text-center text-sm text-slate-500">
                      {formData.companyImage
                        ? `Đã chọn: ${formData.companyImage.name}`
                        : "Tải lên hình ảnh văn phòng, môi trường làm việc"}
                    </span>

                    <input
                      id="companyImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </section>
              </div>

              {/* =====================================
                  RIGHT - PUBLISH
              ===================================== */}
              <div>
                <section className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5">
                  <h2 className="mb-5 text-base font-bold text-slate-900">
                    Xuất bản
                  </h2>

                  {/* Status */}
                  <div className="flex items-center justify-between border-b border-slate-100 py-3">
                    <span className="text-sm text-slate-500">
                      Trạng thái
                    </span>

                    <span className="text-sm font-medium text-orange-500">
                      Bản nháp
                    </span>
                  </div>

                  {/* Visibility */}
                  <div className="flex items-center justify-between border-b border-slate-100 py-3">
                    <span className="text-sm text-slate-500">
                      Hiển thị
                    </span>

                    <span className="text-sm font-medium text-slate-900">
                      Công khai
                    </span>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-slate-500">
                      Hạn đăng tuyển
                    </span>

                    <span className="text-sm font-medium text-slate-900">
                      30 ngày
                    </span>
                  </div>

                  {/* Publish */}
                  <button
                    type="submit"
                    disabled={loading || draftLoading}
                    className="mt-2 h-11 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Đang đăng..."
                      : "Đăng tin"}
                  </button>

                  {/* Save draft */}
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={loading || draftLoading}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {draftLoading
                      ? "Đang lưu..."
                      : "Lưu nháp"}
                  </button>

                  <p className="mt-3 text-center text-xs text-slate-400">
                    Tin sẽ được xét duyệt và xuất bản
                    trong 24 giờ
                  </p>
                </section>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

/* =========================================
   SIDEBAR ITEM
========================================= */

function SidebarItem({
  icon,
  text,
  active = false,
}) {
  return (
    <button
      type="button"
      className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
        active
          ? "bg-blue-600 font-semibold text-white"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <SidebarIcon icon={icon} />

      <span>{text}</span>
    </button>
  );
}

/* =========================================
   SIDEBAR ICON
========================================= */

function SidebarIcon({ icon }) {
  const common = {
    className: "h-4 w-4 shrink-0",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
  };

  switch (icon) {
    case "home":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            d="M3 10.5L12 3l9 7.5M5 9.5V21h14V9.5M9 21v-6h6v6"
          />
        </svg>
      );

    case "building":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            d="M5 21V4a1 1 0 011-1h8a1 1 0 011 1v17M3 21h18M9 7h2M9 11h2M9 15h2M17 9h2M17 13h2M17 17h2"
          />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 5v14M5 12h14"
          />
        </svg>
      );

    case "clipboard":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            d="M9 5h6M9 4a2 2 0 014 0h2a2 2 0 012 2v14H7V6a2 2 0 012-2zM10 10h4M10 14h4"
          />
        </svg>
      );

    case "users":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9.5 11a4 4 0 100-8 4 4 0 000 8zM21 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
          />
        </svg>
      );

    case "file":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            d="M6 3h8l4 4v14H6V3zM14 3v5h5M9 12h6M9 16h6"
          />
        </svg>
      );

    default:
      return null;
  }
}

export default CreateJobPage;
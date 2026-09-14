// Thông tin công ty
import { useState } from "react";

function CompanyInfoPage() {
  const [editing, setEditing] = useState(false);

  const [company, setCompany] = useState({
    name: "FPT Software",
    industry: "Công nghệ thông tin",
    employees: "5000+ nhân viên",
    email: "hr@fpt.com.vn",
    phone: "024 7300 7300",
    website: "fpt.com.vn",
    address: "Tòa nhà FPT, 17 Duy Tân, Cầu Giấy, Hà Nội",
    description:
      "FPT Software là công ty phần mềm hàng đầu Việt Nam với hơn 20 năm kinh nghiệm trong lĩnh vực công nghệ thông tin. Chúng tôi cung cấp các giải pháp phần mềm, dịch vụ gia công và chuyển đổi số cho hơn 1.000 khách hàng tại 26 quốc gia trên toàn thế giới.",
  });

  const handleChange = (e) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-[calc(100vh-52px)] bg-slate-50 p-5">
      {/* TITLE */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-950">Thông tin công ty</h1>

        <button
          onClick={() => setEditing(!editing)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          {editing ? "Lưu thay đổi" : "Chỉnh sửa"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_440px]">
        {/* ================= COMPANY ================= */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            {/* COMPANY HEADER */}
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-xl font-bold text-white">
                FP
              </div>

              <div>
                <h2 className="text-lg font-bold">FPT Software</h2>

                <p className="text-sm text-slate-500">
                  {company.industry} · {company.employees}
                </p>

                <span className="mt-1 inline-flex rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600">
                  ● Đã xác minh
                </span>
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
                  className="h-9 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500"
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
                  className="h-9 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500"
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
                  className="h-9 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500"
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
                  className="h-9 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500"
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
                  className="h-9 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500"
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
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* COMPANY IMAGES */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold">Hình ảnh công ty</h2>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="flex h-24 items-center justify-center rounded-2xl bg-blue-100 text-slate-300">
                🖼
              </div>

              <div className="flex h-24 items-center justify-center rounded-2xl bg-green-100 text-slate-300">
                🖼
              </div>

              <div className="flex h-24 items-center justify-center rounded-2xl bg-yellow-100 text-slate-300">
                🖼
              </div>

              <div className="flex h-24 items-center justify-center rounded-2xl bg-pink-100 text-slate-300">
                🖼
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-4">
          {/* STATISTICS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold">Thống kê</h2>

            <div className="divide-y divide-slate-100">
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500">Tin tuyển dụng</span>

                <strong>12</strong>
              </div>

              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500">Ứng viên</span>

                <strong>356</strong>
              </div>

              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500">Lượt xem hồ sơ</span>

                <strong>1,240</strong>
              </div>

              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500">Tỷ lệ phản hồi</span>

                <strong>78%</strong>
              </div>
            </div>
          </div>

          {/* PREMIUM */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h2 className="text-sm font-bold text-blue-800">
              Nâng cấp tài khoản
            </h2>

            <p className="mt-2 text-xs text-blue-600">
              Đăng không giới hạn tin tuyển dụng và tiếp cận nhiều ứng viên hơn.
            </p>

            <button className="mt-3 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">
              Xem gói Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyInfoPage;

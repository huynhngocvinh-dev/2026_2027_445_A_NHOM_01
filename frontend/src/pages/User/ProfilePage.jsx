import { useState } from "react";

function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: "Nguyễn Văn An",
    email: "an.nguyen@gmail.com",
    phone: "0901 234 567",
    gender: "Nam",
    birthday: "15/05/1998",
    city: "Hà Nội",

    desiredPosition: "Backend Developer",
    desiredSalary: "25 - 35 triệu",
    experience: "3 năm",
    desiredCity: "Hà Nội",

    skills: [
      "Java",
      "Spring Boot",
      "MySQL",
      "Docker",
      "React",
      "TypeScript",
    ],
  });

  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("📤 THÔNG TIN HỒ SƠ:");
    console.log(JSON.stringify(profile, null, 2));

    setEditing(false);
    alert("Cập nhật hồ sơ thành công!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ================= HEADER ================= */}
      <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-full max-w-[1080px] items-center justify-between px-5">
          {/* Logo */}
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

            <span className="text-lg font-bold">JobFinder</span>
          </div>

          {/* Navigation */}
          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="/"
              className="text-sm text-slate-700 hover:text-blue-600"
            >
              Trang chủ
            </a>

            <a
              href="#"
              className="text-sm text-slate-700 hover:text-blue-600"
            >
              Việc làm
            </a>

            <a
              href="#"
              className="text-sm text-slate-700 hover:text-blue-600"
            >
              Đề xuất
            </a>

            <a
              href="#"
              className="text-sm text-slate-700 hover:text-blue-600"
            >
              Yêu thích
            </a>

            <a
              href="#"
              className="text-sm text-slate-700 hover:text-blue-600"
            >
              Ứng tuyển
            </a>
          </nav>

          {/* User */}
          <div className="flex items-center gap-5">
            {/* Notification */}
            <button
              type="button"
              className="relative text-slate-500 hover:text-slate-800"
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
                  strokeWidth="1.7"
                  d="M15 17h5l-1.5-1.5V11a6.5 6.5 0 00-5-6.3V4a1 1 0 10-2 0v.7A6.5 6.5 0 005.5 11v4.5L4 17h5m6 0v1a3 3 0 01-6 0v-1"
                />
              </svg>

              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* Account */}
            <button
              type="button"
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                NV
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium">
                  Nguyễn Văn An
                </p>

                <p className="flex items-center gap-1 text-xs text-slate-400">
                  <span className="font-bold text-red-500">G</span>
                  Google
                </p>
              </div>

              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                  d="M6 9l6 6 6-6"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="mx-auto max-w-[1000px] px-5 pb-10 pt-24">
        {/* ================= PROFILE HEADER ================= */}
        <section className="rounded-2xl border border-slate-200 bg-white p-7">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-xl font-semibold text-white">
                  NA
                </div>

                <button
                  type="button"
                  className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M15.232 5.232l3.536 3.536M4 20l4.5-1 10.268-10.268a2.5 2.5 0 00-3.536-3.536L5 15.464 4 20z"
                    />
                  </svg>
                </button>
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  {profile.fullName}
                </h1>

                <p className="mt-1 text-base text-slate-500">
                  {profile.desiredPosition} · {profile.city}
                </p>

                <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                  <span>{profile.email}</span>
                  <span>{profile.phone}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditing(!editing)}
              className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              {editing ? "Hủy chỉnh sửa" : "Chỉnh sửa hồ sơ"}
            </button>
          </div>

          {/* Progress */}
          <div className="mt-6 border-t border-slate-100 pt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">
                Độ hoàn thiện hồ sơ
              </span>

              <span className="text-sm font-bold text-blue-600">
                80%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[80%] rounded-full bg-blue-600" />
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Hoàn thiện hồ sơ để tăng cơ hội được nhà tuyển dụng tìm thấy
            </p>
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
          {/* ================= LEFT ================= */}
          <div className="space-y-5">
            {/* Thông tin cá nhân */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-6 text-base font-bold">
                Thông tin cá nhân
              </h2>

              <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
                <FormInput
                  label="Họ và tên"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  disabled={!editing}
                />

                <FormInput
                  label="Email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!editing}
                />

                <FormInput
                  label="Số điện thoại"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!editing}
                />

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Giới tính
                  </label>

                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    disabled={!editing}
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-white disabled:text-slate-700"
                  >
                    <option>Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                  </select>
                </div>

                <FormInput
                  label="Ngày sinh"
                  name="birthday"
                  value={profile.birthday}
                  onChange={handleChange}
                  disabled={!editing}
                />

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Thành phố
                  </label>

                  <select
                    name="city"
                    value={profile.city}
                    onChange={handleChange}
                    disabled={!editing}
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-white disabled:text-slate-700"
                  >
                    <option>Hà Nội</option>
                    <option>Hồ Chí Minh</option>
                    <option>Đà Nẵng</option>
                    <option>Cần Thơ</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Thông tin nghề nghiệp */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-6 text-base font-bold">
                Thông tin nghề nghiệp
              </h2>

              <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
                <FormInput
                  label="Vị trí mong muốn"
                  name="desiredPosition"
                  value={profile.desiredPosition}
                  onChange={handleChange}
                  disabled={!editing}
                />

                <FormInput
                  label="Mức lương mong muốn"
                  name="desiredSalary"
                  value={profile.desiredSalary}
                  onChange={handleChange}
                  disabled={!editing}
                />

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Kinh nghiệm
                  </label>

                  <select
                    name="experience"
                    value={profile.experience}
                    onChange={handleChange}
                    disabled={!editing}
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-white disabled:text-slate-700"
                  >
                    <option>Chưa có kinh nghiệm</option>
                    <option>1 năm</option>
                    <option>2 năm</option>
                    <option>3 năm</option>
                    <option>5 năm</option>
                    <option>Trên 5 năm</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Thành phố mong muốn
                  </label>

                  <select
                    name="desiredCity"
                    value={profile.desiredCity}
                    onChange={handleChange}
                    disabled={!editing}
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-white disabled:text-slate-700"
                  >
                    <option>Hà Nội</option>
                    <option>Hồ Chí Minh</option>
                    <option>Đà Nẵng</option>
                    <option>Remote</option>
                  </select>
                </div>
              </div>

              {/* Skills */}
              <div className="mt-5">
                <label className="mb-3 block text-sm font-medium">
                  Kỹ năng
                </label>

                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Save */}
              {editing && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="space-y-5">
            {/* CV */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-5 text-base font-bold">
                CV của tôi
              </h2>

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.7"
                        d="M6 3h8l4 4v14H6V3zM14 3v5h5"
                      />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      CV_NguyenVanAn_2024.pdf
                    </p>

                    <p className="text-xs text-slate-400">
                      Cập nhật 15/03/2024
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="h-9 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-50"
                >
                  Xem CV
                </button>

                <button
                  type="button"
                  className="h-9 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Cập nhật CV
                </button>
              </div>
            </section>

            {/* Hoàn thiện hồ sơ */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-5 text-base font-bold">
                Hoàn thiện hồ sơ
              </h2>

              <ProgressItem
                text="Thông tin cá nhân"
                completed
              />

              <ProgressItem
                text="Kinh nghiệm làm việc"
                completed
              />

              <ProgressItem
                text="Upload CV"
                completed
              />

              <ProgressItem
                text="Kỹ năng"
                completed
              />

              <ProgressItem
                text="Giới thiệu bản thân"
              />

              <ProgressItem
                text="Portfolio / Github"
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= FORM INPUT ================= */

function FormInput({
  label,
  name,
  value,
  onChange,
  disabled,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-white disabled:text-slate-700"
      />
    </div>
  );
}

/* ================= PROGRESS ITEM ================= */

function ProgressItem({ text, completed = false }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      {completed ? (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      ) : (
        <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
      )}

      <span
        className={`text-sm ${
          completed
            ? "text-slate-500 line-through"
            : "text-slate-600"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

export default ProfilePage;
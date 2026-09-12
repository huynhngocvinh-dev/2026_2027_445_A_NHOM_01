import { Link } from "react-router-dom";

const FOOTER_COLUMNS = [
  {
    title: "Về JobFinder",
    links: [
      { label: "Giới thiệu", to: "/about" },
      { label: "Liên hệ", to: "/contact" },
      { label: "Tuyển dụng", to: "/careers" },
    ],
  },
  {
    title: "Dành cho ứng viên",
    links: [
      { label: "Tìm việc làm", to: "/jobs" },
      { label: "Việc làm đã lưu", to: "/account/saved-jobs" },
      { label: "Hồ sơ của tôi", to: "/account/profile" },
    ],
  },
  {
    title: "Dành cho nhà tuyển dụng",
    links: [
      { label: "Đăng tin tuyển dụng", to: "/jobs/create" },
      { label: "Quản lý tin đã đăng", to: "/admin/jobs" },
    ],
  },
];

function Footer() {
  return (
    <footer className="border-t border-[#e1e6ef] bg-[#0b1b3a] px-7 py-10 text-[#c9d3e6]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-[19px] font-bold text-white">JobFinder</p>
          <p className="mt-2 max-w-[220px] text-[11px] leading-[1.7] text-[#8fa0c4]">
            Nền tảng tổng hợp việc làm từ nhiều trang tuyển dụng, giúp bạn tìm
            công việc phù hợp nhanh hơn.
          </p>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-[12px] font-semibold text-white">{col.title}</p>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-[11px] text-[#a9b8dc] no-underline hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-[1180px] border-t border-[#1f2f52] pt-5 text-[10px] text-[#8fa0c4]">
        © {new Date().getFullYear()} JobFinder. Bảo lưu mọi quyền.
      </div>
    </footer>
  );
}

export default Footer;
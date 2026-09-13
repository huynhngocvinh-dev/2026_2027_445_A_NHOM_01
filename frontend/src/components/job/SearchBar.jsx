import { useState } from "react";
import { FiSearch, FiMapPin } from "react-icons/fi";

/**
 * Thanh tìm việc (từ khóa + địa điểm) - tách ra từ Hero của HomePage để
 * dùng lại y hệt ở JobListPage, tránh vẽ lại 2 lần.
 * props:
 * - initialValues: { keyword, location }
 * - onSearch: ({ keyword, location }) => void
 * - variant: "hero" (nền trắng nổi trên nền xanh) | "page" (dùng trong trang thường)
 */
function SearchBar({ initialValues = { keyword: "", location: "" }, onSearch, variant = "hero" }) {
  const [keyword, setKeyword] = useState(initialValues.keyword);
  const [location, setLocation] = useState(initialValues.location);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ keyword, location });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full ${variant === "hero" ? "max-w-[610px] mx-auto" : "max-w-[700px]"}`}
    >
      <div className="bg-white rounded-2xl p-1.5 shadow-xl flex flex-col sm:flex-row">
        <div className="flex-1 flex items-center px-4 h-11">
          <FiSearch className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tên công việc, kỹ năng hoặc từ khóa"
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="hidden sm:block w-px bg-gray-200 my-2" />

        <div className="flex-1 flex items-center px-4 h-11">
          <FiMapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Địa điểm"
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        <button type="submit" className="h-11 px-7 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition">
          Tìm việc
        </button>
      </div>
    </form>
  );
}

export default SearchBar;

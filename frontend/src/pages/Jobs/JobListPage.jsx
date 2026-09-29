import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { jobApi } from "../../api/jobApi";
import { ApiError } from "../../lib/apiClient";
import SearchBar from "../../components/job/SearchBar";
import JobCard from "../../components/job/JobCard";
import JobDetailModal from "../../components/job/JobDetailModal";

const PAGE_SIZE = 6; // Hiển thị tối đa 6 bài viết mỗi trang

// 1. DANH SÁCH ĐỊA ĐIỂM
const LOCATIONS = [
  { label: "Tất cả địa điểm", value: "" },
  { label: "Hà Nội", value: "Hà Nội" },
  { label: "Đà Nẵng", value: "Đà Nẵng" },
  { label: "TP. Hồ Chí Minh", value: "Hồ Chí Minh" },
];

// 2. DANH SÁCH MỨC LƯƠNG (Theo đúng ảnh đính kèm)
const SALARY_RANGES = [
  { label: "Tất cả mức lương", value: "" },
  { label: "Dưới 10 triệu", value: "under-10" },
  { label: "Từ 10-15 triệu", value: "10-15" },
  { label: "Từ 15-20 triệu", value: "15-20" },
  { label: "Từ 20-25 triệu", value: "20-25" },
  { label: "Từ 25-30 triệu", value: "25-30" },
  { label: "Trên 30 triệu", value: "over-30" },
];

// 3. DANH SÁCH KINH NGHIỆM (Theo đúng ảnh đính kèm)
const EXPERIENCES = [
  { label: "Tất cả kinh nghiệm", value: "" },
  { label: "Chưa có kinh nghiệm", value: "Chưa có" },
  { label: "1 năm trở xuống", value: "1 năm trở xuống" },
  { label: "1 năm", value: "1" },
  { label: "2 năm", value: "2" },
  { label: "3 năm", value: "3" },
  { label: "Từ 4-5 năm", value: "4-5" },
];

function JobListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [selectedJob, setSelectedJob] = useState(null);

  // Active Filter Tab Type: 'category' | 'location' | 'salary' | 'experience'
  const [activeFilterTab, setActiveFilterTab] = useState("category");

  const scrollRef = useRef(null);

  // Đọc params từ URL
  const keyword = searchParams.get("keyword") || "";
  const location = searchParams.get("location") || "";
  const category = searchParams.get("category") || "";
  const salaryRange = searchParams.get("salaryRange") || "";
  const experience = searchParams.get("experience") || "";
  const page = Number(searchParams.get("page") || 1);

  // Lấy danh mục ngành nghề từ API Database
  useEffect(() => {
    jobApi
      .getCategories()
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data.map((c) => (typeof c === "string" ? c : c.title)));
        }
      })
      .catch(() => {});
  }, []);

  // Gọi API lấy kết quả danh sách công việc
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setLoadError("");
      try {
        const data = await jobApi.searchJobs({
          keyword,
          location,
          category,
          salaryRange,
          experience,
          page,
          size: PAGE_SIZE,
        });
        if (cancelled) return;

        if (Array.isArray(data)) {
          setResults(data);
          setTotalPages(1);
          setTotalItems(data.length);
        } else {
          setResults(data.content || data.items || []);
          setTotalPages(data.totalPages || 1);
          setTotalItems(data.totalItems || data.totalElements || (data.items?.length ?? 0));
        }
      } catch (error) {
        if (cancelled) return;
        setResults([]);
        setLoadError(
          error instanceof ApiError ? error.message : "Không thể tải dữ liệu việc làm."
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [keyword, location, category, salaryRange, experience, page]);

  const updateFilter = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    next.set("page", "1");
    setSearchParams(next);
  };

  const goToPage = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  const toggleSaveJob = (job) => {
    setSavedJobIds((prev) => {
      const next = new Set(prev);
      next.has(job.id) ? next.delete(job.id) : next.add(job.id);
      return next;
    });
  };

  const scrollTabs = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -250 : 250,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-6 text-gray-900">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        
        {/* 1. KHU VỰC SEARCH BAR CHÍNH */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <SearchBar
            variant="page"
            initialValues={{ keyword, location }}
            onSearch={updateFilter}
          />

          {/* THANH BỘ LỌC DẠNG CAPSULE NẰM NGANG PHÍA TRÊN (TOPCV STYLE) */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
            {/* Đổi loại tiêu chí bộ lọc */}
            <select
              value={activeFilterTab}
              onChange={(e) => setActiveFilterTab(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shrink-0 cursor-pointer"
            >
              <option value="category">Lọc theo: Ngành nghề</option>
              <option value="location">Lọc theo: Địa điểm</option>
              <option value="salary">Lọc theo: Mức lương</option>
              <option value="experience">Lọc theo: Kinh nghiệm</option>
            </select>

            {/* Nút cuộn Trái */}
            <button
              onClick={() => scrollTabs("left")}
              className="w-7 h-7 rounded-full border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 flex items-center justify-center transition shrink-0"
            >
              <FiChevronLeft size={14} />
            </button>

            {/* Danh sách nút bấm Capsule cuộn ngang */}
            <div
              ref={scrollRef}
              className="flex items-center gap-2 overflow-x-auto scrollbar-none scroll-smooth py-1 px-1 flex-1"
            >
              {/* === HIỂN THỊ CÁC CAPSULE THEO LOẠI BỘ LỌC ĐANG CHỌN === */}
              {activeFilterTab === "category" && (
                <>
                  <button
                    onClick={() => updateFilter({ category: "" })}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                      !category
                        ? "bg-blue-600 text-white shadow-sm font-semibold"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Tất cả ngành nghề
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateFilter({ category: cat })}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                        category === cat
                          ? "bg-blue-600 text-white shadow-sm font-semibold"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </>
              )}

              {activeFilterTab === "location" && (
                <>
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc.value}
                      onClick={() => updateFilter({ location: loc.value })}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                        location === loc.value
                          ? "bg-blue-600 text-white shadow-sm font-semibold"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {loc.label}
                    </button>
                  ))}
                </>
              )}

              {activeFilterTab === "salary" && (
                <>
                  {SALARY_RANGES.map((sal) => (
                    <button
                      key={sal.value}
                      onClick={() => updateFilter({ salaryRange: sal.value })}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                        salaryRange === sal.value
                          ? "bg-blue-600 text-white shadow-sm font-semibold"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {sal.label}
                    </button>
                  ))}
                </>
              )}

              {activeFilterTab === "experience" && (
                <>
                  {EXPERIENCES.map((exp) => (
                    <button
                      key={exp.value}
                      onClick={() => updateFilter({ experience: exp.value })}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                        experience === exp.value
                          ? "bg-blue-600 text-white shadow-sm font-semibold"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {exp.label}
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Nút cuộn Phải */}
            <button
              onClick={() => scrollTabs("right")}
              className="w-7 h-7 rounded-full border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 flex items-center justify-center transition shrink-0"
            >
              <FiChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* 2. HEADER THÔNG THỐ KẾT QUẢ */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">
            <strong className="text-blue-600 font-bold text-base">{totalItems}</strong> việc làm được tìm thấy
          </span>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Sắp xếp:</span>
            <select className="border border-gray-200 rounded-lg px-2.5 py-1 bg-white text-gray-800 font-medium focus:outline-none">
              <option value="newest">Mới nhất</option>
              <option value="salary_desc">Lương cao nhất</option>
            </select>
          </div>
        </div>

        {/* 3. DANH SÁCH BÀI ĐĂNG VIỆC LÀM (TOÀN MAN HÌNH, TRẢI DÀI) */}
        {isLoading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-sm text-gray-400">Đang tải việc làm...</p>
          </div>
        ) : loadError ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-sm text-red-500 font-medium">{loadError}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
            <p className="text-base font-bold text-gray-800">Không tìm thấy việc làm phù hợp</p>
            <p className="mt-1 text-xs text-gray-400">Vui lòng chọn tiêu chí lọc khác hoặc nhập từ khóa tìm kiếm mới.</p>
          </div>
        ) : (
          <>
            {/* LƯỚI Bố trí 3 CỘT x 2 HÀNG = TỔNG CỘNG 6 BÀI VIẾT TRÊN TRANG */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.slice(0, 6).map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  saved={savedJobIds.has(job.id)}
                  onToggleSave={toggleSaveJob}
                  onClickCard={(j) => setSelectedJob(j)}
                  onApply={(j) => setSelectedJob(j)}
                />
              ))}
            </div>

            {/* THANH PHÂN TRANG BO TRÒN THEO ĐÚNG MẪU (< 1 / 121 trang >) */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-transparent transition"
                >
                  <FiChevronLeft size={16} />
                </button>

                <span className="text-xs font-semibold text-gray-600">
                  <strong className="text-blue-600 text-sm font-bold">{page}</strong> / {totalPages} trang
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => goToPage(page + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-transparent transition"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL POPUP CHI TIẾT CÔNG VIỆC */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          saved={savedJobIds.has(selectedJob.id)}
          onToggleSave={toggleSaveJob}
        />
      )}
    </div>
  );
}

export default JobListPage;
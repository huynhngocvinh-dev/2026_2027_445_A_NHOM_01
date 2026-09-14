import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { jobApi } from "../api/jobApi";
import { ApiError } from "../lib/apiClient";
import SearchBar from "../components/job/SearchBar";
import CategoryCard from "../components/job/CategoryCard";
 */
function HomePage() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([jobApi.getFeaturedJobs(6), jobApi.getCategories()])
      .then(([featuredJobs, jobCategories]) => {
        if (cancelled) return;
        setJobs(featuredJobs);
        setCategories(jobCategories);
      })
      .catch((error) => {
        if (cancelled) return;
        setLoadError(error instanceof ApiError ? error.message : "Không thể tải dữ liệu việc làm.");
      })
      .finally(() => !cancelled && setIsLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = ({ keyword, location }) => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  const toggleSaveJob = (job) => {
    setSavedJobIds((prev) => {
      const next = new Set(prev);
      next.has(job.id) ? next.delete(job.id) : next.add(job.id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900">
      {/* ===================== HERO ===================== */}
      <section className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
          <div className="min-h-[315px] flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-[38px] font-bold text-white tracking-tight">
              Tìm công việc phù hợp với bạn
            </h1>
            <p className="mt-3 text-blue-100 text-sm sm:text-base">
              Khám phá hàng nghìn cơ hội việc làm từ nhiều nguồn tuyển dụng.
            </p>

            <div className="mt-8 w-full max-w-[610px]">
              <SearchBar onSearch={handleSearch} />
            </div>

            <div className="mt-4 flex flex-wrap justify-center items-center gap-2">
              <span className="text-xs text-blue-100 font-medium mr-1">Tìm nhanh:</span>
              {QUICK_SEARCHES.map((item) => (
                <button
                  key={item}
                  onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(item)}`)}
                  className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-[11px] font-medium transition"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== MAIN CONTENT ===================== */}
      <main className="max-w-[1400px] mx-auto px-5 lg:px-8">
        {/* JOBS */}
        <section className="py-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Việc làm phù hợp với bạn</h2>
              <p className="mt-1 text-sm text-gray-500">Dựa trên kỹ năng và kinh nghiệm của bạn</p>
            </div>
            <button
              onClick={() => navigate("/jobs")}
              className="hidden sm:flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Xem tất cả <FiChevronRight size={14} />
            </button>
          </div>

          {isLoading ? (
            <p className="text-center text-sm text-gray-400 py-10">Đang tải việc làm...</p>
          ) : loadError ? (
            <p className="text-center text-sm text-red-500 py-10">{loadError}</p>
          ) : jobs.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-10">Chưa có việc làm nào để hiển thị.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  saved={savedJobIds.has(job.id)}
                  onToggleSave={toggleSaveJob}
                  onApply={(j) => navigate(`/jobs?highlight=${j.id}`)}
                />
              ))}
            </div>
          )}
        </section>

        {/* CATEGORIES */}
        {categories.length > 0 && (
          <section className="pb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Ngành nghề phổ biến</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((category) => (
                <CategoryCard
                  key={category.title}
                  category={category}
                  onClick={(c) => navigate(`/jobs?category=${encodeURIComponent(c.title)}`)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ===================== CTA ===================== */}
      <section className="bg-blue-600">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
          <div className="py-12 sm:py-14 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Chưa có tài khoản?</h2>
            <p className="mt-2 text-sm text-blue-100">
              Đăng ký để nhận gợi ý việc làm cá nhân hóa và theo dõi ứng tuyển.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => navigate("/register")}
                className="px-7 py-2.5 rounded-full bg-white text-blue-600 hover:bg-blue-50 text-sm font-semibold transition"
              >
                Đăng ký miễn phí
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-7 py-2.5 rounded-full border border-white/40 text-white hover:bg-white/10 text-sm font-semibold transition"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { jobApi } from "../../api/jobApi";
import { ApiError } from "../../lib/apiClient";
import SearchBar from "../../components/job/SearchBar";
import JobCard from "../../components/job/JobCard";

const JOB_TYPES = ["Toàn thời gian", "Bán thời gian", "Remote", "Thực tập"];
const PAGE_SIZE = 9;

/**
 * Trang tìm việc chính cho ứng viên: SearchBar + bộ lọc + danh sách kết quả
 * (JobCard - component tái sử dụng chung) + phân trang. Đọc/ghi bộ lọc qua
 * URL query để có thể chia sẻ link tìm kiếm hoặc bấm Back giữ nguyên kết quả.
 * Dữ liệu lấy từ jobApi (REST thật qua GET /jobs) - không còn dữ liệu giả.
 */
function JobListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [savedJobIds, setSavedJobIds] = useState(new Set());

  const keyword = searchParams.get("keyword") || "";
  const location = searchParams.get("location") || "";
  const category = searchParams.get("category") || "";
  const type = searchParams.get("type") || "";
  const page = Number(searchParams.get("page") || 1);

  useEffect(() => {
    jobApi.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setIsLoading(true);
      setLoadError("");
      try {
        const data = await jobApi.searchJobs({ keyword, location, category, type, page, size: PAGE_SIZE });
        if (cancelled) return;
        // Hỗ trợ cả 2 kiểu response: mảng thuần hoặc { items, totalPages }
        if (Array.isArray(data)) {
          setResults(data);
          setTotalPages(1);
        } else {
          setResults(data.items ?? []);
          setTotalPages(data.totalPages ?? 1);
        }
      } catch (error) {
        if (cancelled) return;
        setResults([]);
        setLoadError(error instanceof ApiError ? error.message : "Không thể tải danh sách việc làm.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [keyword, location, category, type, page]);

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

  return (
    <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-8">
      <h1 className="text-xl font-bold text-gray-900">Tìm việc làm</h1>
      <p className="mt-1 text-sm text-gray-500">
        {isLoading ? "Đang tìm kiếm..." : `${results.length} việc làm phù hợp`}
      </p>

      <div className="mt-4">
        <SearchBar variant="page" initialValues={{ keyword, location }} onSearch={updateFilter} />
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        {/* Sidebar filters */}
        <aside className="h-fit w-full shrink-0 rounded-2xl border border-gray-200 bg-white p-4 lg:w-[220px]">
          <p className="mb-2 text-xs font-semibold text-gray-900">Ngành nghề</p>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => updateFilter({ category: "" })}
              className={`rounded-md px-2 py-1 text-left text-xs ${!category ? "bg-blue-50 font-semibold text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Tất cả
            </button>
            {categories.map((c) => (
              <button
                key={c.title}
                type="button"
                onClick={() => updateFilter({ category: c.title })}
                className={`rounded-md px-2 py-1 text-left text-xs ${category === c.title ? "bg-blue-50 font-semibold text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
              >
                {c.icon} {c.title}
              </button>
            ))}
          </div>

          <p className="mb-2 mt-5 text-xs font-semibold text-gray-900">Hình thức làm việc</p>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => updateFilter({ type: "" })}
              className={`rounded-md px-2 py-1 text-left text-xs ${!type ? "bg-blue-50 font-semibold text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Tất cả
            </button>
            {JOB_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => updateFilter({ type: t })}
                className={`rounded-md px-2 py-1 text-left text-xs ${type === t ? "bg-blue-50 font-semibold text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </aside>

        {/* Results */}
        <div className="min-w-0 flex-1">
          {isLoading ? (
            <p className="text-center text-sm text-gray-400 py-10">Đang tải...</p>
          ) : loadError ? (
            <p className="text-center text-sm text-red-500 py-10">{loadError}</p>
          ) : results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center">
              <p className="text-sm font-semibold text-gray-900">Không tìm thấy việc làm phù hợp</p>
              <p className="mt-1 text-xs text-gray-400">Thử đổi từ khóa hoặc bỏ bớt bộ lọc.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((job) => (
                  <JobCard key={job.id} job={job} saved={savedJobIds.has(job.id)} onToggleSave={toggleSaveJob} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiChevronLeft size={16} />
                  </button>
                  <span className="text-xs text-gray-500">
                    Trang {page}/{totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => goToPage(page + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobListPage;

// Tin Trùng lặp
// Component Icon cảnh báo cho Banner
function AlertIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// Component Icon Merge/Gộp tin
function MergeIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M6 9v12" />
      <path d="M13 6h3a2 2 0 0 1 2 2v7" />
    </svg>
  );
}

export default function DuplicatesPage() {
  // Dữ liệu danh sách cặp tin trùng lặp mẫu
  const duplicatePairs = [
    {
      id: 1,
      similarity: "95%",
      detectedTime: "10:30 · 20/03/2024",
      jobA: {
        label: "Tin A",
        source: "Topcv",
        title: "Java Backend Developer",
        company: "FPT Software",
      },
      jobB: {
        label: "Tin B",
        source: "LinkedIn",
        title: "Java Developer Backend",
        company: "FPT Software",
      },
    },
    {
      id: 2,
      similarity: "88%",
      detectedTime: "10:30 · 20/03/2024",
      jobA: {
        label: "Tin A",
        source: "Topcv",
        title: "React Frontend Developer",
        company: "VNG Corporation",
      },
      jobB: {
        label: "Tin B",
        source: "ITviec",
        title: "Frontend Engineer (React)",
        company: "VNG",
      },
    },
    {
      id: 3,
      similarity: "82%",
      detectedTime: "10:30 · 20/03/2024",
      jobA: {
        label: "Tin A",
        source: "Topcv",
        title: "Product Manager",
        company: "Tiki",
      },
      jobB: {
        label: "Tin B",
        source: "LinkedIn",
        title: "Senior Product Manager",
        company: "Tiki Vietnam",
      },
    },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Tin tuyển dụng trùng lặp
        </h1>
        <p className="mt-1 text-base text-slate-500">
          {duplicatePairs.length} cặp tin trùng được phát hiện
        </p>
      </div>

      {/* WARNING BANNER */}
      <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-amber-800">
        <div className="shrink-0 text-amber-600">
          <AlertIcon size={22} />
        </div>
        <p className="text-sm font-medium">
          <span className="font-bold">Chú ý:</span> Các tin trùng lặp được phát
          hiện tự động bằng AI. Vui lòng xem xét và xử lý từng cặp tin.
        </p>
      </div>

      {/* DUPLICATES LIST */}
      <div className="space-y-6">
        {duplicatePairs.map((pair) => (
          <div
            key={pair.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs"
          >
            {/* Pair Header Info */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-sm font-medium text-slate-500">
                Cặp #{pair.id}
              </span>
              <div className="h-2 w-16 rounded-full bg-red-500" />
              <span className="text-sm font-bold text-red-600">
                Độ giống nhau: {pair.similarity}
              </span>
            </div>

            {/* Comparison Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              {/* Job Card A */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-slate-500">
                      {pair.jobA.label}
                    </span>
                    <span>{pair.jobA.source}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {pair.jobA.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {pair.jobA.company}
                  </p>
                </div>
                <div className="mt-6 border-t border-slate-200/60 pt-3">
                  <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    Xem chi tiết
                  </button>
                </div>
              </div>

              {/* Job Card B */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-slate-500">
                      {pair.jobB.label}
                    </span>
                    <span>{pair.jobB.source}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {pair.jobB.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {pair.jobB.company}
                  </p>
                </div>
                <div className="mt-6 border-t border-slate-200/60 pt-3">
                  <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors">
                  <MergeIcon size={16} />
                  <span>Gộp tin</span>
                </button>
                <button className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  Giữ cả hai
                </button>
                <button className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-red-700 transition-colors">
                  Xóa tin B
                </button>
              </div>

              <span className="text-xs text-slate-400">
                Phát hiện lúc {pair.detectedTime}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

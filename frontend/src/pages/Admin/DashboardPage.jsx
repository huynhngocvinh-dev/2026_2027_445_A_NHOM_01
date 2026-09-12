// Trang chủ Admin
function Icon({ type, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (type) {
    case "home":
      return (
        <svg {...common}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9 21v-6h6v6" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M3 12h18" />
          <path d="M10 12v2h4v-2" />
        </svg>
      );
    case "file":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </svg>
      );
    case "building":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 7h2" />
          <path d="M14 7h2" />
          <path d="M8 11h2" />
          <path d="M14 11h2" />
          <path d="M8 15h2" />
          <path d="M14 15h2" />
          <path d="M10 21v-3h4v3" />
        </svg>
      );
    case "databaseC":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="6" rx="7" ry="3" />
          <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
          <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </svg>
      );
    case "key":
      return (
        <svg {...common}>
          <circle cx="8" cy="15" r="4" />
          <path d="m11 12 9-9" />
          <path d="m17 6 2 2" />
          <path d="m14 9 2 2" />
        </svg>
      );
    default:
      return null;
  }
}

function StatCard({
  title,
  value,
  subText,
  growth,
  icon,
  iconClass,
  growthText,
}) {
  return (
    <div className="min-h-51 flex-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <p className="max-w-37.5 text-lg font-medium leading-7 text-slate-600">
          {title}
        </p>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconClass}`}
        >
          <Icon type={icon} size={22} />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </p>

        {subText && <p className="mt-2 text-sm text-slate-400">{subText}</p>}

        {growth && (
          <p className="mt-3 text-sm font-medium text-green-600">
            ↑ {growth} {growthText}
          </p>
        )}
      </div>
    </div>
  );
}

function DashboardPage() {
  const skillData = [
    { name: "JavaScript", value: 1250 },
    { name: "Python", value: 980 },
    { name: "Java", value: 880 },
    { name: "React", value: 760 },
    { name: "SQL", value: 650 },
    { name: "AWS", value: 520 },
  ];

  const sourceData = [
    {
      name: "Topcv",
      value: "4,820 tin",
      percent: "70%",
      className: "bg-blue-600",
    },
    {
      name: "LinkedIn",
      value: "2,340 tin",
      percent: "50%",
      className: "bg-sky-600",
    },
    {
      name: "VietnamWorks",
      value: "3,120 tin",
      percent: "85%",
      className: "bg-red-600",
    },
    {
      name: "Facebook",
      value: "890 tin",
      percent: "25%",
      className: "bg-blue-500",
    },
    {
      name: "ITviec",
      value: "1,560 tin",
      percent: "40%",
      className: "bg-violet-500",
    },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-1 text-base text-slate-500">
          Tổng quan hệ thống JobFinder
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="flex gap-5 overflow-x-auto pb-2">
        <StatCard
          title="Tổng tin tuyển dụng"
          value="15.240"
          subText="Tất cả thời gian"
          growth="18%"
          growthText="tháng này"
          icon="briefcase"
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Tin mới hôm nay"
          value="1.240"
          growth="5%"
          growthText="hôm qua"
          icon="home"
          iconClass="bg-green-50 text-green-600"
        />

        <StatCard
          title="Công ty"
          value="350"
          growth="12%"
          growthText="tháng này"
          icon="building"
          iconClass="bg-purple-50 text-purple-600"
        />

        <StatCard
          title="Nguồn dữ liệu"
          value="85"
          icon="databaseC"
          iconClass="bg-sky-50 text-sky-600"
        />

        <StatCard
          title="Ứng viên"
          value="2.450"
          growth="9%"
          growthText="tuần này"
          icon="key"
          iconClass="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Ứng tuyển hôm nay"
          value="320"
          growth="15%"
          growthText="hôm qua"
          icon="file"
          iconClass="bg-red-600 text-white"
        />
      </div>

      {/* TOP CHARTS */}
      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-xl font-semibold text-slate-900">
            Tin tuyển dụng theo ngày
          </h2>

          <div className="mt-6 h-65">
            <svg
              viewBox="0 0 900 260"
              className="h-full w-full"
              preserveAspectRatio="none"
            >
              <line
                x1="70"
                y1="25"
                x2="875"
                y2="25"
                stroke="#e2e8f0"
                strokeDasharray="4 5"
              />
              <line
                x1="70"
                y1="75"
                x2="875"
                y2="75"
                stroke="#e2e8f0"
                strokeDasharray="4 5"
              />
              <line
                x1="70"
                y1="125"
                x2="875"
                y2="125"
                stroke="#e2e8f0"
                strokeDasharray="4 5"
              />
              <line
                x1="70"
                y1="175"
                x2="875"
                y2="175"
                stroke="#e2e8f0"
                strokeDasharray="4 5"
              />
              <line
                x1="70"
                y1="225"
                x2="875"
                y2="225"
                stroke="#e2e8f0"
                strokeDasharray="4 5"
              />

              <line
                x1="70"
                y1="25"
                x2="70"
                y2="225"
                stroke="#e2e8f0"
                strokeDasharray="4 5"
              />
              <line
                x1="204"
                y1="25"
                x2="204"
                y2="225"
                stroke="#e2e8f0"
                strokeDasharray="4 5"
              />
              <line
                x1="338"
                y1="25"
                x2="338"
                y2="225"
                stroke="#e2e8f0"
                strokeDasharray="4 5"
              />
              <line
                x1="472"
                y1="25"
                x2="472"
                y2="225"
                stroke="#e2e8f0"
                strokeDasharray="4 5"
              />
              <line
                x1="606"
                y1="25"
                x2="606"
                y2="225"
                stroke="#e2e8f0"
                strokeDasharray="4 5"
              />
              <line
                x1="740"
                y1="25"
                x2="740"
                y2="225"
                stroke="#e2e8f0"
                strokeDasharray="4 5"
              />
              <line
                x1="875"
                y1="25"
                x2="875"
                y2="225"
                stroke="#e2e8f0"
                strokeDasharray="4 5"
              />

              <path
                d="M70 165 C115 145 155 125 204 122 C250 120 292 150 338 145 C385 140 425 105 472 90 C515 76 560 68 606 68 C655 68 700 100 740 92 C790 85 820 65 875 35 L875 225 L70 225 Z"
                fill="#2563eb"
                fillOpacity="0.08"
              />

              <path
                d="M70 165 C115 145 155 125 204 122 C250 120 292 150 338 145 C385 140 425 105 472 90 C515 76 560 68 606 68 C655 68 700 100 740 92 C790 85 820 65 875 35"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
              />

              <text x="30" y="230" fill="#94a3b8" fontSize="14">
                0
              </text>
              <text x="25" y="180" fill="#94a3b8" fontSize="14">
                20
              </text>
              <text x="25" y="130" fill="#94a3b8" fontSize="14">
                40
              </text>
              <text x="25" y="80" fill="#94a3b8" fontSize="14">
                60
              </text>
              <text x="25" y="30" fill="#94a3b8" fontSize="14">
                80
              </text>

              <text x="52" y="250" fill="#94a3b8" fontSize="13">
                14/03
              </text>
              <text x="188" y="250" fill="#94a3b8" fontSize="13">
                15/03
              </text>
              <text x="322" y="250" fill="#94a3b8" fontSize="13">
                16/03
              </text>
              <text x="456" y="250" fill="#94a3b8" fontSize="13">
                17/03
              </text>
              <text x="590" y="250" fill="#94a3b8" fontSize="13">
                18/03
              </text>
              <text x="724" y="250" fill="#94a3b8" fontSize="13">
                19/03
              </text>
              <text x="858" y="250" fill="#94a3b8" fontSize="13">
                20/03
              </text>
            </svg>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-xl font-semibold text-slate-900">
            Theo ngành nghề
          </h2>

          <div className="flex h-65 items-center justify-center">
            <div
              className="h-48 w-48 rounded-full"
              style={{
                background:
                  "conic-gradient(#2563eb 0deg 126deg, #16a34a 126deg 191deg, #f59e0b 191deg 234deg, #dc2626 234deg 270deg, #7c3aed 270deg 295deg, #0284c7 295deg 360deg)",
              }}
            />
          </div>
        </section>
      </div>

      {/* LOWER CHARTS */}
      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-xl font-semibold text-slate-900">
            Top kỹ năng được yêu cầu
          </h2>

          <div className="mt-7 space-y-4">
            {skillData.map((skill) => {
              const width = `${(skill.value / 1400) * 100}%`;

              return (
                <div key={skill.name} className="flex items-center gap-4">
                  <div className="w-20 shrink-0 text-right text-sm text-slate-500">
                    {skill.name}
                  </div>

                  <div className="h-7 flex-1 rounded-md bg-slate-50">
                    <div
                      className="h-7 rounded-md bg-blue-600"
                      style={{ width }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="ml-24 flex justify-between text-xs text-slate-400">
              <span>0</span>
              <span>350</span>
              <span>700</span>
              <span>1050</span>
              <span>1400</span>
            </div>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-xl font-semibold text-slate-900">
            Nguồn dữ liệu
          </h2>

          <div className="mt-7 space-y-4">
            {sourceData.map((source) => (
              <div key={source.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {source.name}
                  </span>

                  <span className="text-slate-500">{source.value}</span>
                </div>

                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full ${source.className}`}
                    style={{ width: source.percent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;

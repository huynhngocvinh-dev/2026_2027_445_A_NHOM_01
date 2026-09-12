// Thống Kê
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// ================= DỮ LIỆU MẪU (MOCK DATA) =================

// 1. Tin tuyển dụng theo ngành (Donut Chart)
const industryData = [
  { name: "Công nghệ thông tin", value: 4820, color: "#2563EB" },
  { name: "Thương mại điện tử", value: 2340, color: "#16A34A" },
  { name: "Fintech", value: 1560, color: "#EAB308" },
  { name: "Marketing", value: 1280, color: "#DC2626" },
  { name: "Tài chính", value: 980, color: "#9333EA" },
  { name: "Khác", value: 2260, color: "#0284C7" },
];

// 2. Tin tuyển dụng theo địa điểm (Bar Chart)
const locationData = [
  { location: "TP. Hồ Chí Minh", count: 6200 },
  { location: "Hà Nội", count: 4800 },
  { location: "Đà Nẵng", count: 1200 },
  { location: "Cần Thơ", count: 500 },
  { location: "Khác", count: 800 },
];

// 3. Lượt ứng tuyển theo thời gian (Area Chart)
const applicationTrendData = [
  { date: "14/03", applications: 25 },
  { date: "15/03", applications: 38 },
  { date: "16/03", applications: 30 },
  { date: "17/03", applications: 50 },
  { date: "18/03", applications: 52 },
  { date: "19/03", applications: 42 },
  { date: "20/03", applications: 64 },
];

// 4. Kỹ năng được yêu cầu nhiều nhất (Horizontal Bar Chart)
const skillData = [
  { skill: "JavaScript", count: 1350 },
  { skill: "Python", count: 980 },
  { skill: "Java", count: 840 },
  { skill: "React", count: 750 },
  { skill: "SQL", count: 620 },
  { skill: "AWS", count: 480 },
];

// 5. Top công ty tuyển dụng nhiều nhất
const topCompaniesData = [
  {
    name: "FPT Software",
    logoText: "F",
    logoBg: "bg-orange-500",
    count: 89,
    max: 100,
  },
  {
    name: "VNG Corporation",
    logoText: "V",
    logoBg: "bg-purple-600",
    count: 76,
    max: 100,
  },
];

function StatisticsPage() {
  const [timeRange, setTimeRange] = useState("30 ngày");

  const timeOptions = ["7 ngày", "30 ngày", "3 tháng", "6 tháng", "1 năm"];

  return (
    <div className="p-8 space-y-6 bg-slate-100 min-h-screen">
      {/* ================= HEADER PAGE ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thống kê</h1>
          <p className="text-sm text-slate-500 mt-1">
            Phân tích dữ liệu nền tảng JobFinder
          </p>
        </div>

        {/* TIME FILTER BUTTONS */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          {timeOptions.map((option) => (
            <button
              key={option}
              onClick={() => setTimeRange(option)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                timeRange === option
                  ? "bg-slate-100 font-semibold text-slate-900 border border-slate-300 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* ================= GRID hàng 1 ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Tin tuyển dụng theo ngành */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Tin tuyển dụng theo ngành
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Donut Chart */}
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={industryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => value.toLocaleString("vi-VN")}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend List */}
            <div className="space-y-2.5 text-xs">
              {industryData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-slate-600 font-medium">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-800">
                    {item.value.toLocaleString("vi-VN")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: Tin tuyển dụng theo địa điểm */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Tin tuyển dụng theo địa điểm
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={locationData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />
                <XAxis
                  dataKey="location"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#64748B" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#64748B" }}
                />
                <Tooltip formatter={(val) => val.toLocaleString("vi-VN")} />
                <Bar
                  dataKey="count"
                  fill="#2563EB"
                  radius={[4, 4, 0, 0]}
                  barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ================= GRID hàng 2 ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Lượt ứng tuyển theo thời gian */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Lượt ứng tuyển theo thời gian
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={applicationTrendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#64748B" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#64748B" }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#16A34A"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorApp)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Kỹ năng được yêu cầu nhiều nhất */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Kỹ năng được yêu cầu nhiều nhất
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={skillData}
                margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#64748B" }}
                />
                <YAxis
                  type="category"
                  dataKey="skill"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  width={75}
                />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#8B5CF6"
                  radius={[0, 4, 4, 0]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ================= GRID hàng 3 ================= */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
        <h2 className="text-base font-bold text-slate-900 mb-6">
          Top công ty tuyển dụng nhiều nhất
        </h2>

        <div className="space-y-5">
          {topCompaniesData.map((company) => (
            <div key={company.name} className="flex items-center gap-4">
              {/* Logo Icon */}
              <div
                className={`w-9 h-9 rounded-lg ${company.logoBg} text-white font-bold flex items-center justify-center shrink-0`}
              >
                {company.logoText}
              </div>

              {/* Company Name */}
              <div className="w-40 shrink-0">
                <p className="text-xs font-bold text-slate-800">
                  {company.name}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="flex-1">
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(company.count / company.max) * 100}%`,
                      backgroundColor: company.logoBg.includes("purple")
                        ? "#8B5CF6"
                        : "#F97316",
                    }}
                  ></div>
                </div>
              </div>

              {/* Count */}
              <div className="w-10 text-right">
                <span className="text-xs font-bold text-slate-800">
                  {company.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;

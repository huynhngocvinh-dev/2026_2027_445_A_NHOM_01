import { useState } from "react";
import {
  FaRobot,
  FaPlay,
  FaTerminal,
  FaToggleOn,
  FaToggleOff,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

export default function CrawlManagementPage() {
  const [autoPilot, setAutoPilot] = useState(false);
  const [crawlUrl, setCrawlUrl] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);
  const [logs, setLogs] = useState([
    `[${new Date().toLocaleTimeString()}] Hệ thống Crawler Bot sẵn sàng...`,
  ]);

  const addLog = (msg) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleToggleAutoPilot = () => {
    const newState = !autoPilot;
    setAutoPilot(newState);
    addLog(
      `Bot Auto-Pilot đã được ${newState ? "KÍCH HOẠT (Quét tự động)" : "TẮT"}.`
    );
    toast.info(`Bot Auto-Pilot: ${newState ? "Bật" : "Tắt"}`);
  };

  const handleStartCrawl = async (e) => {
    e.preventDefault();
    if (!crawlUrl.trim()) {
      toast.warning("Vui lòng nhập URL nhóm/trang Facebook!");
      return;
    }

    if (!crawlUrl.includes("facebook.com")) {
      toast.warning(
        "Đường dẫn phải thuộc nền tảng Facebook (facebook.com/...)"
      );
      return;
    }

    try {
      setIsCrawling(true);
      addLog(`Khởi chạy Bot cào dữ liệu cho URL: ${crawlUrl}`);

      // Gọi API xuống Spring Boot Backend
      const res = await axios.post(
        "http://localhost:8080/api/admin/crawl/start",
        {
          url: crawlUrl,
        }
      );

      addLog(`Server phản hồi: ${res.data.message}`);
      addLog("Bot Puppeteer đang mở Chrome ngầm để cào bài viết...");
      toast.success(
        "Đã gửi lệnh cào thành công! Vui lòng chờ bài viết đổ về trang Duyệt tin."
      );

      setCrawlUrl("");
    } catch (err) {
      addLog(`Lỗi khi gọi Bot: ${err.response?.data?.message || err.message}`);
      toast.error("Không thể kết nối với hệ thống Crawler!");
    } finally {
      setIsCrawling(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <FaRobot className="text-3xl text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý Bot Thu thập dữ liệu
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột trái: Form điều khiển Bot */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card Auto-Pilot */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                Bot Auto-Pilot
              </h3>
              <p className="text-sm text-gray-500">Quét tự động định kỳ</p>
              <span
                className={`inline-block mt-2 text-xs px-2.5 py-1 rounded-full font-medium ${
                  autoPilot
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                ● {autoPilot ? "Đang hoạt động" : "Đang ngủ"}
              </span>
            </div>
            <button
              onClick={handleToggleAutoPilot}
              className="text-4xl transition-colors"
            >
              {autoPilot ? (
                <FaToggleOn className="text-indigo-600 cursor-pointer" />
              ) : (
                <FaToggleOff className="text-gray-400 cursor-pointer" />
              )}
            </button>
          </div>

          {/* Card Cào theo URL Facebook */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-semibold text-lg text-gray-800">
              Cào thủ công theo URL
            </h3>
            <form onSubmit={handleStartCrawl} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Nhập link Facebook Group / Page tuyển dụng:
                </label>
                <input
                  type="url"
                  placeholder="https://www.facebook.com/groups/327940020092140"
                  value={crawlUrl}
                  onChange={(e) => setCrawlUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isCrawling}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50"
              >
                {isCrawling ? (
                  <>
                    <FaSpinner className="animate-spin" /> Đang khởi chạy Bot...
                  </>
                ) : (
                  <>
                    <FaPlay className="text-xs" /> Tiến hành cào dữ liệu
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Cột phải: Terminal Logs */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900 rounded-2xl p-4 text-slate-200 font-mono text-sm h-[380px] flex flex-col shadow-lg border border-slate-800">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
              <div className="flex items-center gap-2">
                <FaTerminal />
                <span className="text-xs">crawler_bot_status.log</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
              {logs.map((log, idx) => (
                <p key={idx} className="leading-relaxed text-slate-300">
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

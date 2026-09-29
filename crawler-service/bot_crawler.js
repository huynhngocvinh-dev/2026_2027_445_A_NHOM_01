import "dotenv/config";
import puppeteer from "puppeteer";
import axios from "axios";
import fs from "fs";

// Có thể cấu hình qua file .env (xem .env.example) thay vì hardcode
const SPRING_BOOT_API =
  process.env.SPRING_BOOT_API ||
  "http://localhost:8080/api/admin/approval/receive-raw";

// "new" (mặc định) = chạy ẩn, phù hợp server không có màn hình.
// Đặt CRAWLER_HEADLESS=false trong .env nếu muốn xem trực tiếp bot cuộn trang khi debug local.
const HEADLESS_MODE = process.env.CRAWLER_HEADLESS === "false" ? false : "new";

const SCROLL_STEPS = Number(process.env.CRAWLER_SCROLL_STEPS || 8);
const SCROLL_DELAY_MS = Number(process.env.CRAWLER_SCROLL_DELAY_MS || 2500);

// Từ khóa đặc trưng của tin tuyển dụng, dùng để lọc bớt bình luận/gợi ý không liên quan.
// Chỉ cần khớp 1 trong các nhóm dưới là đủ điều kiện xét làm "khả năng là tin tuyển dụng".
const JOB_KEYWORDS = [
  "tuyển",
  "tuyển dụng",
  "ứng viên",
  "ứng tuyển",
  "yêu cầu",
  "mô tả công việc",
  "quyền lợi",
  "mức lương",
  "lương",
  "full-time",
  "part-time",
  "hr@",
  "zalo",
];

const NOISE_PATTERNS = [
  "Viết bình luận",
  "Xem thêm bình luận",
  "Người tham gia ẩn danh",
  "Tất cả bình luận",
  "Thêm vào tin",
];

/**
 * Kiểm tra nhanh xem trang hiện tại có phải trang đăng nhập / checkpoint
 * (dấu hiệu cookie đã hết hạn hoặc tài khoản bị Facebook yêu cầu xác minh).
 */
async function detectLoginOrCheckpoint(page) {
  const url = page.url();
  if (url.includes("/login") || url.includes("/checkpoint")) {
    return true;
  }
  const hasLoginForm = await page
    .$('form[data-testid="royal_login_form"], input[name="email"][id="email"]')
    .then((el) => !!el)
    .catch(() => false);
  return hasLoginForm;
}

function looksLikeJobPost(text) {
  if (text.length <= 70) return false;
  if (NOISE_PATTERNS.some((p) => text.includes(p))) return false;
  if (text.startsWith("Người tham gia ẩn danh")) return false;

  const lower = text.toLowerCase();
  const matchesKeyword = JOB_KEYWORDS.some((kw) => lower.includes(kw));
  return matchesKeyword;
}

async function collectVisiblePosts(page) {
  return page.evaluate(() => {
    const results = [];
    const elements = document.querySelectorAll(
      'div[data-ad-preview="message"], div[dir="auto"]'
    );
    elements.forEach((el) => {
      const text = el.innerText ? el.innerText.trim() : "";
      if (text.length > 0) results.push(text);
    });
    return results;
  });
}

async function runBotCrawl(targetUrl) {
  if (!fs.existsSync("./facebook_cookies.json")) {
    console.error(
      "[LỖI] Chưa có file facebook_cookies.json! Hãy chạy getCookie.js trước."
    );
    process.exitCode = 1;
    return;
  }

  const cookies = JSON.parse(
    fs.readFileSync("./facebook_cookies.json", "utf8")
  );

  const browser = await puppeteer.launch({
    headless: HEADLESS_MODE,
    args: [
      "--disable-notifications",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--start-maximized",
    ],
  });

  // Gom bài đăng đã thấy được qua toàn bộ quá trình cuộn (kể cả những bài
  // Facebook đã "unmount" khỏi DOM sau khi cuộn qua - virtualized feed).
  const seen = new Set();

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.setCookie(...cookies);

    console.log(`[BOT] Đang truy cập: ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 60000 });

    if (await detectLoginOrCheckpoint(page)) {
      console.error(
        "[LỖI] Cookie đã hết hạn hoặc tài khoản bị Facebook yêu cầu xác minh (checkpoint). " +
          "Hãy chạy lại getCookie.js để đăng nhập và lưu cookie mới."
      );
      process.exitCode = 2;
      return;
    }

    console.log(`[BOT] Đang cuộn trang lấy bài viết (${SCROLL_STEPS} bước)...`);
    for (let i = 0; i < SCROLL_STEPS; i++) {
      await page.evaluate(() => window.scrollBy(0, 800));
      await new Promise((resolve) => setTimeout(resolve, SCROLL_DELAY_MS));

      // Thu thập ngay sau mỗi lần cuộn, không đợi tới cuối, vì Facebook có
      // thể unmount các bài đã cuộn qua khỏi DOM (virtual scrolling).
      const batch = await collectVisiblePosts(page);
      batch.forEach((text) => {
        if (looksLikeJobPost(text)) seen.add(text);
      });

      console.log(
        `[BOT] Bước ${i + 1}/${SCROLL_STEPS} - đã thu thập ${
          seen.size
        } bài hợp lệ`
      );
    }

    const posts = Array.from(seen);
    console.log(`[BOT] Tìm thấy ${posts.length} bài đăng tuyển dụng hợp lệ.`);

    if (posts.length === 0) {
      console.warn(
        "[CẢNH BÁO] Không tìm thấy bài nào khớp bộ lọc. Có thể do: nhóm không có tin phù hợp " +
          "trong lần cào này, hoặc Facebook đã đổi cấu trúc DOM, hoặc bộ lọc từ khóa quá chặt."
      );
    }

    let successCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;

    for (const rawText of posts) {
      try {
        const res = await axios.post(SPRING_BOOT_API, {
          rawContent: rawText,
          sourceUrl: targetUrl,
        });
        if (res.data?.duplicate) {
          duplicateCount++;
          console.log(`[SKIP] Bài đã tồn tại trước đó, backend đã bỏ qua.`);
        } else {
          successCount++;
          console.log(`[SUCCESS] Đã lưu bài đăng vào DB. ID: ${res.data.id}`);
        }
      } catch (err) {
        errorCount++;
        console.error(
          `[ERROR] Lỗi gửi Backend (Status ${err.response?.status}): ${err.message}`
        );
      }
    }

    console.log(
      `[BOT] Hoàn tất: ${successCount} bài mới, ${duplicateCount} trùng lặp (bỏ qua), ${errorCount} lỗi gửi.`
    );
  } catch (err) {
    console.error("[LỖI NGHIÊM TRỌNG]", err.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
    console.log("[BOT] Đã đóng trình duyệt.");
  }
}

const targetGroupUrl = process.argv[2];
if (!targetGroupUrl) {
  console.error(
    "[LỖI] Thiếu URL nhóm/trang Facebook. Cách dùng: node bot_crawler.js <url>"
  );
  process.exit(1);
}
runBotCrawl(targetGroupUrl);

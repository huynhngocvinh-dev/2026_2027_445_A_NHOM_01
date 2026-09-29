import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs";
import readline from "readline";

puppeteer.use(StealthPlugin());

// Hàm hỗ trợ dừng chương trình chờ người dùng nhấn ENTER trên Terminal
const waitForEnter = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(
      "\n👉 Sau khi đăng nhập thành công vào Facebook, hãy quay lại đây và nhấn [ENTER] để lưu Cookie...\n",
      () => {
        rl.close();
        resolve();
      }
    );
  });
};

async function getFBCookie() {
  console.log(
    "🚀 Đang mở Chrome... Vui lòng đăng nhập tài khoản Facebook Clone!"
  );

  const browser = await puppeteer.launch({
    headless: false, // Hiện giao diện Chrome
    defaultViewport: null,
    args: ["--start-maximized", "--disable-notifications"],
  });

  const page = await browser.newPage();

  // Mở trang đăng nhập Facebook
  await page.goto("https://www.facebook.com/", { waitUntil: "networkidle2" });

  // Tạm dừng chương trình vô thời hạn cho tới khi bạn gõ xong và bấm ENTER ở Terminal
  await waitForEnter();

  try {
    // Lấy toàn bộ Cookie của phiên đăng nhập hiện tại
    const cookies = await page.cookies();

    // Kiểm tra xem đã có cookie c_user chưa (xác nhận đăng nhập thành công)
    const isLoggedIn = cookies.some((c) => c.name === "c_user");

    if (isLoggedIn) {
      fs.writeFileSync(
        "./facebook_cookies.json",
        JSON.stringify(cookies, null, 2)
      );
      console.log(
        "✅ TUYỆT VỜI! Đã lưu thành công Cookie vào file facebook_cookies.json."
      );
      console.log(
        "Bởi vì đã có cookie, bạn có thể khởi chạy bot_crawler.js để cào dữ liệu!"
      );
    } else {
      console.log(
        "❌ CHƯA ĐĂNG NHẬP THÀNH CÔNG! Trong trình duyệt vẫn chưa có tài khoản. Vui lòng thử lại."
      );
    }
  } catch (error) {
    console.log("⚠️ Đã xảy ra lỗi khi trích xuất Cookie:", error.message);
  } finally {
    await browser.close();
  }
}

getFBCookie();

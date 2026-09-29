package com.jobCrawler.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/crawl")
@CrossOrigin(origins = "*")
public class CrawlController {

    @PostMapping("/start")
    public ResponseEntity<?> startCrawl(@RequestBody Map<String, String> payload) {
        String url = payload.get("url");

        if (url == null || url.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "URL không được để trống!"));
        }

        // Chạy Bot Node.js trong luồng ngầm (Background Thread) để không bị treo Request trên Web
        new Thread(() -> {
            try {
                // Đường dẫn tới thư mục crawler-service (chỉnh sửa lại cho đúng cấu trúc máy bạn nếu cần)
                File crawlerDir = new File("../crawler-service");

                // Lệnh chạy Node.js
                ProcessBuilder processBuilder = new ProcessBuilder("node", "bot_crawler.js", url);
                processBuilder.directory(crawlerDir);
                processBuilder.redirectErrorStream(true);

                Process process = processBuilder.start();

                // Đọc log xuất ra từ bot
                BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println("[BOT LOG] " + line);
                }

                process.waitFor();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();

        return ResponseEntity.ok(Map.of("message", "Đã kích hoạt Bot cào dữ liệu thành công cho URL!"));
    }
}
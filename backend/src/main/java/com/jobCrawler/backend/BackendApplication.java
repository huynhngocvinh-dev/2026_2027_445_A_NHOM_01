package com.jobCrawler.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
// Bắt buộc phải có annotation này để @Async trong AiParsingService.parseAndPersist()
// thực sự chạy nền (không có annotation này, @Async sẽ bị Spring bỏ qua và chạy đồng bộ như cũ).
@EnableAsync
public class BackendApplication {

    public static void main(String[] args) {
        // Nạp file .env vào System properties trước khi Spring context khởi động
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing() 
                .load();
        
        dotenv.entries().forEach(entry -> 
            System.setProperty(entry.getKey(), entry.getValue())
        );

        SpringApplication.run(BackendApplication.class, args);
    }

}
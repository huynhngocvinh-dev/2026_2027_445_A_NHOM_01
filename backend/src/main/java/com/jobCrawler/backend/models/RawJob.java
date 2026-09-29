package com.jobCrawler.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "raw_jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RawJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String rawContent;

    @Column(name = "source_url", length = 1000)
    private String sourceUrl;

    @Column(name = "status")
    private String status; // PENDING, APPROVED, REJECTED

    @Column(name = "crawled_at")
    private LocalDateTime crawledAt;

    // Dữ liệu bóc tách tạm dạng JSON String. Có thể là null trong lúc AI
    // đang xử lý bất đồng bộ - Frontend cần hiển thị trạng thái "đang xử lý"
    // khi field này rỗng thay vì hiểu nhầm là AI bóc tách thất bại.
    @Column(columnDefinition = "TEXT")
    private String parsedDataJson;

    // true khi AiParsingService đã xử lý xong (thành công hoặc rơi vào fallback).
    // false = vẫn đang chờ / đang xử lý.
    @Column(name = "ai_processed")
    @Builder.Default
    private Boolean aiProcessed = false;

    // Hash SHA-256 của rawContent (đã trim), dùng để chống lưu trùng khi bot
    // cào lại cùng một bài đăng nhiều lần.
    @Column(name = "content_hash", unique = true, length = 64)
    private String contentHash;
}
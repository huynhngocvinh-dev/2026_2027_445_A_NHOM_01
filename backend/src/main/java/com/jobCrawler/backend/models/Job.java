package com.jobCrawler.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Có thể null nếu bài đăng do Bot cào về (chưa gắn với HR cụ thể)
    @ManyToOne
    @JoinColumn(name = "employer_id", nullable = true)
    private User employer;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = true)
    private Company company;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "category")
    private String category; // Ngành nghề (IT, Marketing, Sales...)

    // Bỏ nullable = false để lưu được tin cào không có Email
    @Column(name = "hr_email", nullable = true) 
    private String hrEmail;

    // Bổ sung SĐT liên hệ cho tin cào từ Facebook/Zalo
    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(columnDefinition = "TEXT")
    private String benefits;

    @Column(name = "min_salary")
    private Integer minSalary;

    @Column(name = "max_salary")
    private Integer maxSalary;

    private String location;

    @Column(name = "job_type")
    private String jobType; // Full-time, Part-time

    private String experience;

    @Column(name = "company_image_name")
    private String companyImageName;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Bổ sung Hạn nộp hồ sơ
    @Column(name = "deadline")
    private LocalDateTime deadline;
    
    @Column(name = "status")
    private String status; // PENDING, APPROVED, REJECTED, EXPIRED

    // --- PHÂN LOẠI NGUỒN BÀI ĐĂNG ---
    @Column(name = "post_type")
    private String postType; // "INTERNAL" (HR đăng) hoặc "CRAWLED" (Bot cào)

    @Column(name = "source")
    private String source; // "SYSTEM", "FACEBOOK", "TOPCV", v.v.

    @Column(name = "original_link", length = 1000)
    private String originalLink;
}
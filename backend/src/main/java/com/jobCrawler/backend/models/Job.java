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

    @ManyToOne
    @JoinColumn(name = "employer_id")
    private User employer;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "hr_email", nullable = false)
    private String hrEmail;

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
    private String jobType;

    private String experience;

    @Column(name = "company_image_name")
    private String companyImageName;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "status")
    private String status; 
    
    // Nguồn bài đăng (Ví dụ: "HR", "CRAWLER")
    @Column(name = "source")
    private String source;

    // Link bài gốc (Dành cho việc làm cào từ MXH, HR đăng thì để null)
    @Column(name = "original_link", length = 1000)
    private String originalLink;
}
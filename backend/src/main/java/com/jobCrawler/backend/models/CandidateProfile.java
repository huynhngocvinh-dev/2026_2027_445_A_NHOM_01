package com.jobCrawler.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String title; // Vị trí mong muốn
    
    @Column(columnDefinition = "TEXT")
    private String summary; // Giới thiệu bản thân (Bio)

    private String cvUrl; // Link hoặc tên CV chính
    
    @Column(columnDefinition = "TEXT")
    private String skills; // Kỹ năng
    
    private String experience; // Kinh nghiệm
    private String desiredSalary; // Mức lương mong muốn

    private String location;        // Địa điểm (Thành phố)
    private String level;           // Cấp bậc mong muốn (Intern, Fresher, v.v.)
    private String workType;        // Hình thức làm việc (Full-time, Part-time, v.v.)
    private String jobStatus;       // Trạng thái tìm việc
    
    private String github;          // Link GitHub
    private String linkedin;        // Link LinkedIn
    private String portfolio;       // Website cá nhân

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
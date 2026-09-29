package com.jobCrawler.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate; // Người dùng nộp CV (Role CANDIDATE)

    private String coverLetter;
    private String cvUrl; // URL file CV dùng khi nộp tin này

    @Column(name = "status")
    private String status; // PENDING (Chờ duyệt), REVIEWING (Đang xem), ACCEPTED (Trúng tuyển), REJECTED (Từ chối)

    private LocalDateTime appliedAt;

    @PrePersist
    protected void onCreate() {
        appliedAt = LocalDateTime.now();
        if (status == null) {
            status = "PENDING";
        }
    }
}
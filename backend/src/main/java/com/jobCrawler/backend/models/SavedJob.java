package com.jobCrawler.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedJob {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Tương ứng saved_job_id

    // Nối với bảng User (Người tìm việc)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Nối với bảng JobPost (Tin tuyển dụng)
    // Lưu ý: Lần trước mình đặt tên entity là Job, nếu em đổi thành JobPost thì sửa lại chữ Job dưới đây nhé.
    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
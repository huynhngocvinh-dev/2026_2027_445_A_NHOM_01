package com.jobCrawler.backend.controllers;

import com.jobCrawler.backend.models.Job;
import com.jobCrawler.backend.models.SavedJob;
import com.jobCrawler.backend.models.User;
import com.jobCrawler.backend.repositories.JobRepository;
import com.jobCrawler.backend.repositories.SavedJobRepository;
import com.jobCrawler.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/saved-jobs")
@CrossOrigin(origins = "*")
public class SavedJobController {

    @Autowired
    private SavedJobRepository savedJobRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JobRepository jobRepository;

    // 1. API Nút Lưu / Bỏ lưu công việc (Dùng chung 1 nút)
    @PostMapping("/toggle")
    public ResponseEntity<?> toggleSaveJob(@RequestBody Map<String, Object> request) {
        String email = (String) request.get("userEmail");
        Long jobId = ((Number) request.get("jobId")).longValue();

        if (email == null || jobId == null) {
            return ResponseEntity.badRequest().body("Lỗi: Thiếu thông tin email hoặc jobId!");
        }

        // Tìm User
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Không tìm thấy người dùng!");
        }
        User user = userOpt.get();

        // Chặn nhà tuyển dụng tự đi lưu việc làm
        if (!"JOB_SEEKER".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.badRequest().body("Lỗi: Chỉ Người tìm việc mới có thể lưu bài đăng!");
        }

        // Tìm Job
        Optional<Job> jobOpt = jobRepository.findById(jobId);
        if (jobOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Bài tuyển dụng không tồn tại!");
        }
        Job job = jobOpt.get();

        // Kiểm tra xem đã lưu chưa
        Optional<SavedJob> existingSavedJob = savedJobRepository.findByUserAndJob(user, job);
        
        if (existingSavedJob.isPresent()) {
            // Nếu đã lưu rồi -> Bấm lại là Hủy lưu (Xóa khỏi DB)
            savedJobRepository.delete(existingSavedJob.get());
            return ResponseEntity.ok("Đã bỏ lưu công việc này.");
        } else {
            // Nếu chưa lưu -> Thêm mới vào DB
            SavedJob newSavedJob = SavedJob.builder()
                    .user(user)
                    .job(job)
                    .createdAt(LocalDateTime.now())
                    .build();
            savedJobRepository.save(newSavedJob);
            return ResponseEntity.ok("Đã lưu công việc thành công.");
        }
    }

    // 2. API Lấy danh sách việc làm đã lưu của 1 ứng viên
    @GetMapping("/my-list")
    public ResponseEntity<?> getMySavedJobs(@RequestParam String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Không tìm thấy người dùng!");
        }
        
        List<SavedJob> savedJobs = savedJobRepository.findByUserOrderByCreatedAtDesc(userOpt.get());
        return ResponseEntity.ok(savedJobs);
    }
}
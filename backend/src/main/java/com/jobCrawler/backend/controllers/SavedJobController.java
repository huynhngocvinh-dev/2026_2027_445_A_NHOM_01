package com.jobCrawler.backend.controllers;

import com.jobCrawler.backend.models.Job;
import com.jobCrawler.backend.models.SavedJob;
import com.jobCrawler.backend.models.User;
import com.jobCrawler.backend.repositories.JobRepository;
import com.jobCrawler.backend.repositories.SavedJobRepository;
import com.jobCrawler.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/saved-jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SavedJobController {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    // 1. Lấy danh sách việc làm đã lưu của User
    @GetMapping
    public ResponseEntity<?> getSavedJobs(@RequestHeader("X-User-Id") Long userId) {
        List<SavedJob> savedJobs = savedJobRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<Job> jobs = savedJobs.stream().map(SavedJob::getJob).toList();
        return ResponseEntity.ok(jobs);
    }

    // 2. Lấy danh sách ID các bài viết đã lưu (để Frontend render màu icon)
    @GetMapping("/ids")
    public ResponseEntity<List<Long>> getSavedJobIds(@RequestHeader("X-User-Id") Long userId) {
        List<SavedJob> savedJobs = savedJobRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<Long> jobIds = savedJobs.stream().map(sj -> sj.getJob().getId()).toList();
        return ResponseEntity.ok(jobIds);
    }

    // 3. Toggle Lưu / Bỏ lưu công việc
    @PostMapping("/{jobId}")
    @Transactional
    public ResponseEntity<?> toggleSaveJob(@PathVariable Long jobId, @RequestHeader("X-User-Id") Long userId) {
        boolean isSaved = savedJobRepository.existsByUserIdAndJobId(userId, jobId);

        if (isSaved) {
            savedJobRepository.deleteByUserIdAndJobId(userId, jobId);
            return ResponseEntity.ok("UNSAVED");
        } else {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User không tồn tại"));
            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new RuntimeException("Job không tồn tại"));

            SavedJob savedJob = SavedJob.builder()
                    .user(user)
                    .job(job)
                    .createdAt(LocalDateTime.now())
                    .build();

            savedJobRepository.save(savedJob);
            return ResponseEntity.ok("SAVED");
        }
    }
}
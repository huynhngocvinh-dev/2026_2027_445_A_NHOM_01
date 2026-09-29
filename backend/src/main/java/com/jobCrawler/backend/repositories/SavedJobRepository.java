package com.jobCrawler.backend.repositories;

import com.jobCrawler.backend.models.SavedJob;
import com.jobCrawler.backend.models.User;
import com.jobCrawler.backend.models.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    // Kiểm tra xem User đã lưu Job này chưa
    Optional<SavedJob> findByUserAndJob(User user, Job job);
    
    // Lấy danh sách việc làm đã lưu của 1 User cụ thể
    List<SavedJob> findByUserOrderByCreatedAtDesc(User user);
}
package com.jobCrawler.backend.repositories;

import com.jobCrawler.backend.models.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    
    // Tìm các tin đã lưu của 1 user
    List<SavedJob> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Kiểm tra xem User đã lưu Job này chưa
    Optional<SavedJob> findByUserIdAndJobId(Long userId, Long jobId);

    // Xóa tin đã lưu
    void deleteByUserIdAndJobId(Long userId, Long jobId);
    
    // Kiểm tra tồn tại
    boolean existsByUserIdAndJobId(Long userId, Long jobId);
}
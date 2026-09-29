package com.jobCrawler.backend.repositories;

import com.jobCrawler.backend.models.RawJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RawJobRepository extends JpaRepository<RawJob, Long> {
    List<RawJob> findByStatusOrderByIdDesc(String status);

    // Dùng để chống lưu trùng: kiểm tra bài đăng (theo hash nội dung) đã tồn tại chưa
    boolean existsByContentHash(String contentHash);
}
package com.jobCrawler.backend.repositories;

import com.jobCrawler.backend.models.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // Lấy danh sách hồ sơ ứng tuyển vào các Job do 1 HR cụ thể đăng
    @Query("SELECT a FROM Application a WHERE a.job.employer.id = :hrUserId")
    List<Application> findAllByHrUserId(@Param("hrUserId") Long hrUserId);

    // Đếm số lượng ứng viên đã nộp vào các Job của HR (Phục vụ phần Thống kê)
    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.employer.id = :hrUserId")
    long countCandidatesByHrUserId(@Param("hrUserId") Long hrUserId);

    // Lịch sử ứng tuyển của 1 Candidate
    List<Application> findByCandidateId(Long candidateId);
}
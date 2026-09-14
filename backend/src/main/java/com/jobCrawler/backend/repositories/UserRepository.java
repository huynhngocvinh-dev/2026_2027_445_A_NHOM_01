package com.jobCrawler.backend.repositories;

import com.jobCrawler.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional; // THÊM IMPORT NÀY

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    // --- BÁC LAO CÔNG SẼ DÙNG HÀM NÀY ĐỂ XÓA ---
    @Transactional
    void deleteByIsVerifiedFalseAndOtpExpirationTimeBefore(LocalDateTime time);
}
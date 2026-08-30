package com.jobCrawler.backend.repositories;

import com.jobCrawler.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Hàm này giúp hệ thống tìm xem email đã có ai đăng ký chưa
    Optional<User> findByEmail(String email);
}
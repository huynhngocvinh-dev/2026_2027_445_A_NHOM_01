package com.jobCrawler.backend.services;

import com.jobCrawler.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserCleanupService {

    @Autowired
    private UserRepository userRepository;

    // fixedRate = 60000 nghĩa là cứ 60.000 mili-giây (1 phút) sẽ chạy hàm này 1 lần
    @Scheduled(fixedRate = 60000) 
    public void cleanupUnverifiedUsers() {
        LocalDateTime now = LocalDateTime.now();
        
        // Thực thi lệnh xóa các user chưa xác thực (isVerified = false) VÀ đã hết hạn OTP
        userRepository.deleteByIsVerifiedFalseAndOtpExpirationTimeBefore(now);
        
        // In ra Terminal để em dễ theo dõi
        System.out.println("⏰ [" + now + "] Bác lao công vừa đi tuần tra và dọn dẹp DB!");
    }
}
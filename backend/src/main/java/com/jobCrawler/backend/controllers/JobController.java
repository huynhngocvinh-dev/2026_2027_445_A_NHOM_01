package com.jobCrawler.backend.controllers;

import com.jobCrawler.backend.models.Job;
import com.jobCrawler.backend.models.User;
import com.jobCrawler.backend.repositories.JobRepository;
import com.jobCrawler.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private UserRepository userRepository;

    // ==========================================
    // LUỒNG 1: HR TỰ ĐĂNG BÀI TRÊN WEB
    // ==========================================
    @PostMapping("/hr/create")
    public ResponseEntity<?> createJobByHR(@RequestBody Job requestJob) {
        // 1. CHUẨN HÓA DỮ LIỆU ĐẦU VÀO
        if (requestJob.getStatus() == null || requestJob.getStatus().trim().isEmpty()) {
            requestJob.setStatus("DRAFT"); 
        }
        
        if (requestJob.getJobTitle() != null && requestJob.getJobTitle().length() > 100) {
             return ResponseEntity.badRequest().body("Lỗi: Tên công việc không được vượt quá 100 ký tự!");
        }
        
        // TÌM VÀ LIÊN KẾT NHÀ TUYỂN DỤNG VÀO TIN ĐĂNG
        if (requestJob.getHrEmail() == null || requestJob.getHrEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Không xác định được danh tính nhà tuyển dụng (Thiếu hrEmail)!");
        }

        Optional<User> employerOpt = userRepository.findByEmail(requestJob.getHrEmail());
        if (employerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Tài khoản nhà tuyển dụng không tồn tại trong hệ thống!");
        }
        
        // KIỂM TRA QUYỀN (ROLE) CỦA USER
        User employer = employerOpt.get();
        if (!"EMPLOYER".equalsIgnoreCase(employer.getRole())) {
            return ResponseEntity.badRequest().body("Lỗi: Chỉ tài khoản Nhà tuyển dụng mới được phép đăng tin!");
        }
        
        // Gắn object User, đánh dấu nguồn là HR và xóa link gốc (nếu có)
        requestJob.setEmployer(employer);
        requestJob.setSource("HR");
        requestJob.setOriginalLink(null);

        // 2. CHỈ KIỂM TRA GẮT GAO KHI "ĐĂNG TIN" (PUBLISHED)
        if (requestJob.getStatus().equals("PUBLISHED")) {
            if (requestJob.getJobTitle() == null || requestJob.getJobTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Lỗi: Tên công việc (jobTitle) không được để trống khi đăng tin!");
            }
            if (requestJob.getCompanyName() == null || requestJob.getCompanyName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Lỗi: Tên công ty (companyName) không được để trống!");
            }
            if (requestJob.getLocation() == null || requestJob.getLocation().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Lỗi: Vui lòng nhập địa điểm làm việc (location)!");
            }
            
            // Xử lý lương cho trạng thái Đăng tin
            if (requestJob.getMinSalary() == null || requestJob.getMaxSalary() == null) {
                return ResponseEntity.badRequest().body("Lỗi: Vui lòng nhập đầy đủ mức lương!");
            }
            if (requestJob.getMinSalary() < 0 || requestJob.getMaxSalary() < 0) {
                return ResponseEntity.badRequest().body("Lỗi: Mức lương không được là số âm!");
            }
            if (requestJob.getMinSalary() > requestJob.getMaxSalary()) {
                return ResponseEntity.badRequest().body("Lỗi: Lương tối thiểu không được lớn hơn lương tối đa!");
            }
        }

        // 3. ĐÓNG GÓI VÀ LƯU DATABASE
        requestJob.setCreatedAt(LocalDateTime.now());
        Job savedJob = jobRepository.save(requestJob);

        if (savedJob.getStatus().equals("PUBLISHED")) {
            return ResponseEntity.ok("Đăng tin tuyển dụng thành công!");
        } else {
            return ResponseEntity.ok("Đã lưu bản nháp thành công!");
        }
    }

    // ==========================================
    // LUỒNG 2: TOOL CÀO DỮ LIỆU TỪ MẠNG XÃ HỘI
    // ==========================================
    @PostMapping("/crawler/import")
    public ResponseEntity<?> importJobFromCrawler(@RequestBody Job crawledJob) {
        // Bài cào từ MXH bắt buộc phải có link gốc
        if (crawledJob.getOriginalLink() == null || crawledJob.getOriginalLink().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Bài đăng cào từ MXH bắt buộc phải có originalLink.");
        }

        // Đóng dấu nguồn gốc là CRAWLER và mặc định PUBLISHED
        crawledJob.setSource("CRAWLER");
        crawledJob.setStatus("PUBLISHED");
        
        // Gán vào một tài khoản Bot hệ thống
        String botEmail = "system_bot@jobcrawler.com";
        if (crawledJob.getHrEmail() == null || crawledJob.getHrEmail().trim().isEmpty()) {
            crawledJob.setHrEmail(botEmail);
        }
        
        Optional<User> botOpt = userRepository.findByEmail(crawledJob.getHrEmail());
        if (botOpt.isPresent()) {
            crawledJob.setEmployer(botOpt.get());
        }

        crawledJob.setCreatedAt(LocalDateTime.now());
        jobRepository.save(crawledJob);
        
        return ResponseEntity.ok("Tool cào dữ liệu đã import bài thành công!");
    }

    // ==========================================
    // LUỒNG 3: LẤY DANH SÁCH VIỆC LÀM CHO TRANG CHỦ
    // ==========================================
    @GetMapping("/home")
    public ResponseEntity<?> getHomepageJobs() {
        // Hàm này tự động gọi xuống SQL lấy dữ liệu không cần input manual
        List<Job> jobs = jobRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(jobs);
    }
}
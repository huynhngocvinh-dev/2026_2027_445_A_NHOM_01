package com.jobCrawler.backend.controllers;

import com.jobCrawler.backend.models.Job;
import com.jobCrawler.backend.models.User;
import com.jobCrawler.backend.repositories.JobRepository;
import com.jobCrawler.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private UserRepository userRepository;

    // ==========================================
    // LUỒNG TÌM KIẾM & PHÂN TRANG (SỬA LỖI 404 CỦA FRONTEND REACT)
    // ==========================================
    @GetMapping
    public ResponseEntity<?> searchJobs(
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false, defaultValue = "") String location,
            @RequestParam(required = false, defaultValue = "") String category,
            @RequestParam(required = false, defaultValue = "") String salaryRange,
            @RequestParam(required = false, defaultValue = "") String experience,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int size) {

        // 1. Lấy tất cả tin tuyển dụng đã xuất bản (PUBLISHED)
        List<Job> allJobs = jobRepository.findAllByOrderByCreatedAtDesc();

        // 2. Lọc danh sách theo các điều kiện từ React Frontend
        List<Job> filteredJobs = allJobs.stream().filter(job -> {
            // Lọc theo từ khóa (Tiêu đề hoặc Tên công ty)
            boolean matchKeyword = keyword.isBlank() || 
                (job.getJobTitle() != null && job.getJobTitle().toLowerCase().contains(keyword.toLowerCase())) ||
                (job.getCompanyName() != null && job.getCompanyName().toLowerCase().contains(keyword.toLowerCase()));

            // Lọc theo Địa điểm
            boolean matchLocation = location.isBlank() || 
                (job.getLocation() != null && job.getLocation().toLowerCase().contains(location.toLowerCase()));

            // Lọc theo Ngành nghề
            boolean matchCategory = category.isBlank() || 
                (job.getCategory() != null && job.getCategory().equalsIgnoreCase(category));

            return matchKeyword && matchLocation && matchCategory;
        }).collect(Collectors.toList());

        // 3. Phân trang thủ công (Tránh lỗi out of bound)
        int totalItems = filteredJobs.size();
        int totalPages = (int) Math.ceil((double) totalItems / size);
        if (totalPages == 0) totalPages = 1;

        int currentPage = Math.max(1, Math.min(page, totalPages));
        int fromIndex = (currentPage - 1) * size;
        int toIndex = Math.min(fromIndex + size, totalItems);

        List<Job> pageItems = (fromIndex < totalItems) 
                ? filteredJobs.subList(fromIndex, toIndex) 
                : Collections.emptyList();

        // 4. Đóng gói JSON trả về chuẩn cho React
        Map<String, Object> response = new HashMap<>();
        response.put("items", pageItems);
        response.put("currentPage", currentPage);
        response.put("totalPages", totalPages);
        response.put("totalItems", totalItems);

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // LUỒNG 1: HR TỰ ĐĂNG BÀI TRÊN WEB
    // ==========================================
    @PostMapping("/hr/create")
    public ResponseEntity<?> createJobByHR(@RequestBody Job requestJob) {
        if (requestJob.getStatus() == null || requestJob.getStatus().trim().isEmpty()) {
            requestJob.setStatus("DRAFT");
        }
        
        if (requestJob.getJobTitle() != null && requestJob.getJobTitle().length() > 100) {
             return ResponseEntity.badRequest().body("Lỗi: Tên công việc không được vượt quá 100 ký tự!");
        }
        
        if (requestJob.getHrEmail() == null || requestJob.getHrEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Không xác định được danh tính nhà tuyển dụng (Thiếu hrEmail)!");
        }

        Optional<User> employerOpt = userRepository.findByEmail(requestJob.getHrEmail());
        if (employerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Tài khoản nhà tuyển dụng không tồn tại trong hệ thống!");
        }
        
        User employer = employerOpt.get();
        if (!"EMPLOYER".equalsIgnoreCase(employer.getRole())) {
            return ResponseEntity.badRequest().body("Lỗi: Chỉ tài khoản Nhà tuyển dụng mới được phép đăng tin!");
        }
        
        requestJob.setEmployer(employer);
        requestJob.setSource("HR");
        requestJob.setOriginalLink(null);

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
        if (crawledJob.getOriginalLink() == null || crawledJob.getOriginalLink().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Bài đăng cào từ MXH bắt buộc phải có originalLink.");
        }

        crawledJob.setSource("CRAWLER");
        crawledJob.setStatus("PUBLISHED");
        
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
        List<Job> jobs = jobRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(jobs);
    }

    // ==========================================
    // LUỒNG 4: API BỔ SUNG CHO FRONTEND HOMEPAGE
    // ==========================================
    
    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedJobs(@RequestParam(defaultValue = "6") int limit) {
        List<Job> jobs = jobRepository.findAllByOrderByCreatedAtDesc();
        if (jobs.size() > limit) {
            jobs = jobs.subList(0, limit);
        }
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        List<Job> allJobs = jobRepository.findAll();
        Map<String, Long> categoryCountMap = new HashMap<>();

        for (Job job : allJobs) {
            String cat = (job.getCategory() != null && !job.getCategory().isBlank()) 
                    ? job.getCategory() 
                    : "Công nghệ thông tin";
            categoryCountMap.put(cat, categoryCountMap.getOrDefault(cat, 0L) + 1);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        long id = 1;
        for (Map.Entry<String, Long> entry : categoryCountMap.entrySet()) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", id++);
            map.put("title", entry.getKey());
            map.put("count", entry.getValue());
            result.add(map);
        }

        if (result.isEmpty()) {
            result = List.of(
                Map.of("id", 1, "title", "Công nghệ thông tin", "count", 12),
                Map.of("id", 2, "title", "Marketing / Truyền thông", "count", 8),
                Map.of("id", 3, "title", "Thiết kế đồ họa", "count", 5),
                Map.of("id", 4, "title", "Kế toán / Tài chính", "count", 6)
            );
        }

        return ResponseEntity.ok(result);
    }
}
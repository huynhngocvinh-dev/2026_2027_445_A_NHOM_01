package com.jobCrawler.backend.controllers;

import com.jobCrawler.backend.dto.ParsedJobDTO;
import com.jobCrawler.backend.models.Job;
import com.jobCrawler.backend.models.RawJob;
import com.jobCrawler.backend.repositories.JobRepository;
import com.jobCrawler.backend.repositories.RawJobRepository;
import com.jobCrawler.backend.services.AiParsingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/approval")
@CrossOrigin(origins = "*")
public class JobApprovalController {

    @Autowired
    private RawJobRepository rawJobRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private AiParsingService aiParsingService;

    // 1. Nhận dữ liệu cào từ Bot Node.js đẩy về
    @PostMapping("/receive-raw")
    public ResponseEntity<?> receiveRawJob(@RequestBody Map<String, String> body) {
        String rawContent = body.get("rawContent");
        String sourceUrl = body.get("sourceUrl");

        if (rawContent == null || rawContent.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Nội dung bài viết rỗng"));
        }

        String contentHash = sha256(rawContent.trim());

        // Chống trùng: nếu bài đăng (theo nội dung) đã tồn tại trong hàng chờ/đã xử lý
        // trước đó thì bỏ qua ngay, không lưu thêm bản ghi và không tốn quota gọi AI.
        if (rawJobRepository.existsByContentHash(contentHash)) {
            return ResponseEntity.ok(Map.of(
                    "message", "Bài đăng đã tồn tại trước đó, đã bỏ qua",
                    "duplicate", true));
        }

        try {
            RawJob rawJob = RawJob.builder()
                    .rawContent(rawContent)
                    .sourceUrl(sourceUrl)
                    .status("PENDING")
                    .crawledAt(LocalDateTime.now())
                    .contentHash(contentHash)
                    .aiProcessed(false)
                    .parsedDataJson(null)
                    .build();

            RawJob savedJob = rawJobRepository.save(rawJob);

            // Gọi Gemini bất đồng bộ (không chặn response trả về cho bot) -
            // parsedDataJson và aiProcessed sẽ được cập nhật sau khi xử lý xong.
            aiParsingService.parseAndPersist(savedJob.getId(), rawContent);

            return ResponseEntity.ok(Map.of(
                    "message", "Đã lưu tin thô, đang xử lý AI bóc tách...",
                    "id", savedJob.getId()));

        } catch (Exception e) {
            System.err.println("[CONTROLLER ERROR] Lỗi hệ thống khi lưu RawJob: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("message", "Lỗi lưu DB: " + e.getMessage()));
        }
    }

    // 2. Lấy danh sách tin thô chưa duyệt cho Frontend React
    @GetMapping("/pending")
    public ResponseEntity<List<RawJob>> getPendingRawJobs() {
        return ResponseEntity.ok(rawJobRepository.findByStatusOrderByIdDesc("PENDING"));
    }

    // 3. Admin bấm Phê duyệt -> Tạo Record chính thức trong bảng jobs
    @PostMapping("/approve/{rawJobId}")
    public ResponseEntity<?> approveJob(@PathVariable Long rawJobId, @RequestBody ParsedJobDTO dto) {
        RawJob rawJob = rawJobRepository.findById(rawJobId)
                .orElseThrow(() -> new RuntimeException("Tin thô không tồn tại ID: " + rawJobId));

        Job job = Job.builder()
                .jobTitle(dto.getJobTitle() != null && !dto.getJobTitle().isEmpty() ? dto.getJobTitle() : "Tin tuyển dụng")
                .companyName(dto.getCompanyName())
                .category(dto.getCategory())
                .hrEmail(dto.getHrEmail())
                .contactPhone(dto.getContactPhone())

                // ĐỔI SANG .intValue() CHO KHỚP KIỂU Integer TRONG Job.java
                .minSalary(dto.getMinSalary() != null ? dto.getMinSalary().intValue() : null)
                .maxSalary(dto.getMaxSalary() != null ? dto.getMaxSalary().intValue() : null)

                .location(dto.getLocation())
                .jobType(dto.getJobType() != null && !dto.getJobType().isEmpty() ? dto.getJobType() : "Full-time")
                .experience(dto.getExperience())
                .description(dto.getDescription() != null && !dto.getDescription().isEmpty() ? dto.getDescription() : rawJob.getRawContent())
                .requirements(dto.getRequirements())
                .benefits(dto.getBenefits())
                .status("APPROVED")
                .postType("CRAWLED")
                .source("FACEBOOK_CRAWL")
                .originalLink(rawJob.getSourceUrl())
                .createdAt(LocalDateTime.now())
                .build();

        jobRepository.save(job);

        // Cập nhật trạng thái tin thô thành APPROVED
        rawJob.setStatus("APPROVED");
        rawJobRepository.save(rawJob);

        return ResponseEntity.ok(Map.of("message", "Đã duyệt và lưu bài đăng chính thức vào CSDL thành công!"));
    }

    // 4. Admin bấm Từ chối tin rác
    @DeleteMapping("/reject/{rawJobId}")
    public ResponseEntity<?> rejectJob(@PathVariable Long rawJobId) {
        RawJob rawJob = rawJobRepository.findById(rawJobId)
                .orElseThrow(() -> new RuntimeException("Tin thô không tồn tại ID: " + rawJobId));

        rawJob.setStatus("REJECTED");
        rawJobRepository.save(rawJob);
        return ResponseEntity.ok(Map.of("message", "Đã từ chối tin thô!"));
    }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            // Không thể xảy ra với SHA-256 (thuật toán luôn tồn tại trong JVM chuẩn),
            // nhưng nếu có lỗi thì dùng hashCode làm phương án dự phòng để không chặn luồng lưu bài.
            return String.valueOf(input.hashCode());
        }
    }
}
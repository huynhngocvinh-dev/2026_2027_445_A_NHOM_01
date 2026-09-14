package com.jobCrawler.backend.controllers;

import com.jobCrawler.backend.models.Job;
import com.jobCrawler.backend.models.SearchHistory;
import com.jobCrawler.backend.repositories.JobRepository;
import com.jobCrawler.backend.repositories.SearchHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private SearchHistoryRepository historyRepository;

    @GetMapping("/jobs")
    public ResponseEntity<?> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String userEmail) {

        // Khởi tạo bằng chuỗi rỗng thay vì null để sửa lỗi PostgreSQL bytea
        String cleanKeyword = "";

        if (keyword != null && !keyword.trim().isEmpty()) {
            cleanKeyword = keyword.trim().replaceAll("\\s+", " ");
            if (cleanKeyword.length() > 100) {
                return ResponseEntity.badRequest().body("Từ khóa tìm kiếm không được vượt quá 100 ký tự.");
            }
        }

        // Khởi tạo bằng chuỗi rỗng thay vì null
        String cleanLocation = (location != null && !location.trim().isEmpty()) ? location.trim() : "";
        
        List<Job> results = jobRepository.searchJobs(cleanKeyword, cleanLocation);

        // Đổi điều kiện kiểm tra từ (cleanKeyword != null) thành (!cleanKeyword.isEmpty())
        if (userEmail != null && !userEmail.trim().isEmpty() && !cleanKeyword.isEmpty()) {
            Optional<SearchHistory> existingOpt = historyRepository.findByUserEmailAndKeyword(userEmail, cleanKeyword);
            if (existingOpt.isPresent()) {
                SearchHistory existingHistory = existingOpt.get();
                existingHistory.setSearchedAt(LocalDateTime.now());
                historyRepository.save(existingHistory);
            } else {
                SearchHistory newHistory = SearchHistory.builder()
                        .userEmail(userEmail)
                        .keyword(cleanKeyword)
                        .location(cleanLocation)
                        .searchedAt(LocalDateTime.now())
                        .build();
                historyRepository.save(newHistory);
            }
        }

        return ResponseEntity.ok(results);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getSearchHistory(@RequestParam String userEmail) {
        if (userEmail == null || userEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Thiếu thông tin người dùng!");
        }
        List<SearchHistory> list = historyRepository.findByUserEmailOrderBySearchedAtDesc(userEmail);
        if (list.size() > 10) {
            list = list.subList(0, 10);
        }
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/history/delete/{id}")
    public ResponseEntity<?> deleteSingleHistory(@PathVariable Long id) {
        if (!historyRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("Không tìm thấy bản ghi lịch sử này.");
        }
        historyRepository.deleteById(id);
        return ResponseEntity.ok("Đã xóa từ khóa khỏi lịch sử.");
    }

    @DeleteMapping("/history/delete-all")
    public ResponseEntity<?> deleteAllHistory(@RequestParam String userEmail) {
        historyRepository.deleteByUserEmail(userEmail);
        return ResponseEntity.ok("Đã xóa sạch lịch sử tìm kiếm.");
    }
}
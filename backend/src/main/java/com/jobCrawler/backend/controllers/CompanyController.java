package com.jobCrawler.backend.controllers;

import com.jobCrawler.backend.dto.CompanyDTO;
import com.jobCrawler.backend.services.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    // Lấy thông tin công ty theo HR User ID
    @GetMapping("/hr/{hrUserId}")
    public ResponseEntity<CompanyDTO> getCompanyByHrId(@PathVariable Long hrUserId) {
        // Service đã tự xử lý trả về DTO mặc định nếu chưa có trong DB
        return ResponseEntity.ok(companyService.getCompanyByHrId(hrUserId));
    }

    // Cập nhật hoặc lưu thông tin công ty
    @PutMapping("/hr/{hrUserId}")
    public ResponseEntity<CompanyDTO> updateCompany(
            @PathVariable Long hrUserId,
            @RequestBody CompanyDTO dto) {
        return ResponseEntity.ok(companyService.saveOrUpdateCompany(hrUserId, dto));
    }
}
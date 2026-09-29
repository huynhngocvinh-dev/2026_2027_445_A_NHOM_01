package com.jobCrawler.backend.controllers;

import com.jobCrawler.backend.dto.CompanyDTO;
import com.jobCrawler.backend.services.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/company")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    public ResponseEntity<CompanyDTO> getCompanyInfo(@RequestHeader("X-HR-User-Id") Long hrUserId) {
        return ResponseEntity.ok(companyService.getCompanyByHrId(hrUserId));
    }

    @PostMapping
    public ResponseEntity<CompanyDTO> saveOrUpdateCompany(
            @RequestHeader("X-HR-User-Id") Long hrUserId,
            @RequestBody CompanyDTO dto) {
        return ResponseEntity.ok(companyService.saveOrUpdateCompany(hrUserId, dto));
    }
}
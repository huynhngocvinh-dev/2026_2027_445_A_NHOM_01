package com.jobCrawler.backend.services;

import com.jobCrawler.backend.dto.CompanyDTO;
import com.jobCrawler.backend.models.Company;
import com.jobCrawler.backend.repositories.ApplicationRepository;
import com.jobCrawler.backend.repositories.CompanyRepository;
import com.jobCrawler.backend.repositories.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    /**
     * Lấy thông tin công ty theo hrUserId.
     * Nếu chưa có trong DB -> Trả về DTO khởi tạo mặc định (Tránh lỗi 404 ở Front-end).
     */
    public CompanyDTO getCompanyByHrId(Long hrUserId) {
        long jobCount = jobRepository.countByEmployerId(hrUserId);
        long candidateCount = applicationRepository.countCandidatesByHrUserId(hrUserId);

        // Tìm công ty hoặc tự tạo đối tượng Company mới nếu chưa tồn tại
        Company company = companyRepository.findByHrUserId(hrUserId)
                .orElseGet(() -> Company.builder()
                        .hrUserId(hrUserId)
                        .isVerified(false)
                        .images(Collections.emptyList())
                        .build());

        return CompanyDTO.builder()
                .name(company.getName())
                .industry(company.getIndustry())
                .employees(company.getEmployees())
                .email(company.getEmail())
                .phone(company.getPhone())
                .website(company.getWebsite())
                .address(company.getAddress())
                .description(company.getDescription())
                .isVerified(company.isVerified())
                .images(company.getImages() != null ? company.getImages() : Collections.emptyList())
                .totalJobs(jobCount)
                .totalCandidates(candidateCount)
                .totalViews(0L)
                .build();
    }

    /**
     * Lưu hoặc Cập nhật thông tin công ty theo hrUserId.
     */
    @Transactional
    public CompanyDTO saveOrUpdateCompany(Long hrUserId, CompanyDTO dto) {
        // 1. Tìm hoặc Khởi tạo entity Company mới
        Company company = companyRepository.findByHrUserId(hrUserId)
                .orElseGet(() -> Company.builder()
                        .hrUserId(hrUserId)
                        .isVerified(false)
                        .build());

        // 2. Cập nhật các trường dữ liệu
        company.setName(dto.getName());
        company.setIndustry(dto.getIndustry());
        company.setEmployees(dto.getEmployees());
        company.setEmail(dto.getEmail());
        company.setPhone(dto.getPhone());
        company.setWebsite(dto.getWebsite());
        company.setAddress(dto.getAddress());
        company.setDescription(dto.getDescription());

        if (dto.getImages() != null) {
            company.setImages(dto.getImages());
        }

        // 3. Lưu xuống CSDL (Tự động INSERT nếu chưa có, UPDATE nếu đã có)
        Company savedCompany = companyRepository.save(company);

        // 4. Lấy lại các số liệu thống kê thực tế để trả về
        long jobCount = jobRepository.countByEmployerId(hrUserId);
        long candidateCount = applicationRepository.countCandidatesByHrUserId(hrUserId);

        return CompanyDTO.builder()
                .name(savedCompany.getName())
                .industry(savedCompany.getIndustry())
                .employees(savedCompany.getEmployees())
                .email(savedCompany.getEmail())
                .phone(savedCompany.getPhone())
                .website(savedCompany.getWebsite())
                .address(savedCompany.getAddress())
                .description(savedCompany.getDescription())
                .isVerified(savedCompany.isVerified())
                .images(savedCompany.getImages())
                .totalJobs(jobCount)
                .totalCandidates(candidateCount)
                .totalViews(0L)
                .build();
    }
}
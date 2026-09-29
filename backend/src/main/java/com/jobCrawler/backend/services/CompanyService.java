package com.jobCrawler.backend.services;

import com.jobCrawler.backend.dto.CompanyDTO;
import com.jobCrawler.backend.models.Company;
import com.jobCrawler.backend.repositories.ApplicationRepository;
import com.jobCrawler.backend.repositories.CompanyRepository;
import com.jobCrawler.backend.repositories.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public CompanyDTO getCompanyByHrId(Long hrUserId) {
        Optional<Company> companyOpt = companyRepository.findByHrUserId(hrUserId);
        
        long jobCount = jobRepository.countByEmployerId(hrUserId);
        long candidateCount = applicationRepository.countCandidatesByHrUserId(hrUserId); // Con số thực tế từ DB

        if (companyOpt.isEmpty()) {
            return CompanyDTO.builder()
                    .totalJobs(jobCount)
                    .totalCandidates(candidateCount)
                    .totalViews(0L)
                    .build();
        }

        Company company = companyOpt.get();

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
                .images(company.getImages())
                .totalJobs(jobCount)
                .totalCandidates(candidateCount)
                .totalViews(0L)
                .build();
    }


    public CompanyDTO saveOrUpdateCompany(Long hrUserId, CompanyDTO dto) {
        Company company = companyRepository.findByHrUserId(hrUserId)
                .orElse(Company.builder().hrUserId(hrUserId).isVerified(false).build());

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

        Company savedCompany = companyRepository.save(company);
        
        long jobCount = jobRepository.countByEmployerId(hrUserId);

        dto.setIsVerified(savedCompany.isVerified());
        dto.setImages(savedCompany.getImages());
        dto.setTotalJobs(jobCount);
        dto.setTotalCandidates(0L);
        dto.setTotalViews(0L);

        return dto;
    }
}
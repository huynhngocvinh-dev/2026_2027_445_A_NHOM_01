package com.jobCrawler.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyDTO {
    private String name;
    private String industry;
    private String employees;
    private String email;
    private String phone;
    private String website;
    private String address;
    private String description;
    private Boolean isVerified;
    private List<String> images;

    private Long totalJobs;
    private Long totalCandidates;
    private Long totalViews;
}
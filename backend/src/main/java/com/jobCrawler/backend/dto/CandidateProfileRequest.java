package com.jobCrawler.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CandidateProfileRequest {
    private String fullName;
    private String phoneNumber;
    private String location;
    private String title;
    private String level;
    private String experience;
    private String salaryExpectation;
    private String workType;
    private String jobStatus;
    private String skills;
    private String bio;
    private String github;
    private String linkedin;
    private String portfolio;
}
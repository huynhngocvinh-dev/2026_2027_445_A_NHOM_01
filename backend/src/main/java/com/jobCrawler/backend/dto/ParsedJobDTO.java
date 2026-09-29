package com.jobCrawler.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ParsedJobDTO {

    @JsonProperty("jobTitle")
    private String jobTitle;

    @JsonProperty("companyName")
    private String companyName;

    @JsonProperty("category")
    private String category;

    @JsonProperty("hrEmail")
    private String hrEmail;

    @JsonProperty("contactPhone")
    private String contactPhone;

    @JsonProperty("minSalary")
    private Long minSalary;

    @JsonProperty("maxSalary")
    private Long maxSalary;

    @JsonProperty("location")
    private String location;

    @JsonProperty("jobType")
    private String jobType;

    @JsonProperty("experience")
    private String experience;

    @JsonProperty("description")
    private String description;

    @JsonProperty("requirements")
    private String requirements;

    @JsonProperty("benefits")
    private String benefits;
}
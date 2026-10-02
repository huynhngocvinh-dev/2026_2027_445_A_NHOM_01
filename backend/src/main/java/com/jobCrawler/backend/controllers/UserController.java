package com.jobCrawler.backend.controllers;

import com.jobCrawler.backend.dto.CandidateProfileRequest;
import com.jobCrawler.backend.models.CandidateProfile;
import com.jobCrawler.backend.models.User;
import com.jobCrawler.backend.repositories.CandidateProfileRepository;
import com.jobCrawler.backend.models.User;
import com.jobCrawler.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @PostMapping("/profile")
public ResponseEntity<?> updateCandidateProfile(@RequestBody CandidateProfileRequest request, Principal principal) {
    if (principal == null) {
        return ResponseEntity.status(401).body(Map.of("message", "Chưa xác thực người dùng!"));
    }

    String email = principal.getName();
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

    // 1. Cập nhật thông tin cơ bản vào bảng User
    user.setFullName(request.getFullName());
    user.setPhoneNumber(request.getPhoneNumber());
    userRepository.save(user);

    // 2. Cập nhật hoặc tạo mới thông tin chi tiết vào bảng CandidateProfile
    CandidateProfile profile = candidateProfileRepository.findByUser(user)
        .orElse(new CandidateProfile());
    
    profile.setUser(user);
    profile.setTitle(request.getTitle());
    profile.setSummary(request.getBio());
    profile.setSkills(request.getSkills());
    profile.setExperience(request.getExperience());
    profile.setDesiredSalary(request.getSalaryExpectation());
    profile.setLocation(request.getLocation());
    profile.setLevel(request.getLevel());
    profile.setWorkType(request.getWorkType());
    profile.setJobStatus(request.getJobStatus());
    profile.setGithub(request.getGithub());
    profile.setLinkedin(request.getLinkedin());
    profile.setPortfolio(request.getPortfolio());

    candidateProfileRepository.save(profile);

    return ResponseEntity.ok(Map.of("message", "Cập nhật hồ sơ thành công!"));
}
}
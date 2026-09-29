package com.jobCrawler.backend.controllers;

import com.jobCrawler.backend.models.User;
import com.jobCrawler.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // ==========================================
    // LUỒNG LẤY DANH SÁCH TOÀN BỘ NGƯỜI DÙNG
    // ==========================================
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
}
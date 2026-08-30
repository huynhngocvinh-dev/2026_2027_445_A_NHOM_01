package com.jobCrawler.backend.controllers;

import com.jobCrawler.backend.models.User;
import com.jobCrawler.backend.repositories.UserRepository;
import com.jobCrawler.backend.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") 
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

   @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String fullName = request.get("fullName");
        String phoneNumber = request.get("phoneNumber");
        String role = request.get("role"); 

        // 1. Kiểm tra độ mạnh của mật khẩu (Regex)
        String passwordRegex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$";
        if (password == null || !password.matches(passwordRegex)) {
            return ResponseEntity.badRequest().body("Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@#$%^&+=!).");
        }

        // 2. Kiểm tra email đã tồn tại trong hệ thống chưa
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("Email đã được sử dụng!");
        }

        // 3. Thuật toán tạo mã OTP 6 chữ số ngẫu nhiên
        String otp = String.format("%06d", new Random().nextInt(999999));

        // 4. Đóng gói dữ liệu và lưu vào Database 
        User newUser = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password)) // Mật khẩu được băm bảo mật
                .fullName(fullName)
                .phoneNumber(phoneNumber)
                .role(role)
                .isVerified(false)
                .otpCode(otp)
                .otpExpirationTime(LocalDateTime.now().plusMinutes(5)) 
                .authProvider("LOCAL") 
                .build();

        userRepository.save(newUser);

        // 5. Bắn email OTP cho người dùng
        emailService.sendOtpEmail(email, otp);

        return ResponseEntity.ok("Đăng ký thành công! Vui lòng kiểm tra email để nhận mã OTP.");
    }
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otpCode = request.get("otpCode");

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Không tìm thấy tài khoản!");
        }

        User user = userOptional.get();

        if (user.isVerified()) {
            return ResponseEntity.badRequest().body("Tài khoản này đã được xác thực từ trước!");
        }
        
        if (!user.getOtpCode().equals(otpCode)) {
            return ResponseEntity.badRequest().body("Mã OTP không chính xác!");
        }
        
        if (user.getOtpExpirationTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Mã OTP đã hết hạn!");
        }

        user.setVerified(true);
        user.setOtpCode(null); 
        user.setOtpExpirationTime(null);
        userRepository.save(user);

        return ResponseEntity.ok("Xác thực tài khoản thành công!");
    }
    @PostMapping("/social-login")
    public ResponseEntity<?> socialLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String fullName = request.get("fullName");
        String provider = request.get("provider"); 
        String providerId = request.get("providerId"); 
        
        String role = request.containsKey("role") ? request.get("role") : "CANDIDATE"; 

        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setAuthProvider(provider);
            user.setProviderId(providerId);
            userRepository.save(user);
            return ResponseEntity.ok("Đăng nhập " + provider + " thành công!");
        } else {
            User newUser = User.builder()
                    .email(email)
                    .fullName(fullName)
                    .password("") 
                    .role(role)
                    .isVerified(true) 
                    .authProvider(provider)
                    .providerId(providerId)
                    .build();

            userRepository.save(newUser);
            return ResponseEntity.ok("Đăng ký bằng " + provider + " thành công!");
        }
    }
}
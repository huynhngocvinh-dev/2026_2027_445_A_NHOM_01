package com.jobCrawler.backend.controllers;

import com.jobCrawler.backend.models.User;
import com.jobCrawler.backend.repositories.UserRepository;
import com.jobCrawler.backend.security.JwtUtil;
import com.jobCrawler.backend.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
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

    @Autowired
    private JwtUtil jwtUtil;

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
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body("Vui lòng nhập đầy đủ email và mật khẩu!");
        }

        Optional<User> userOptional = userRepository.findByEmail(email.trim());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email hoặc mật khẩu không chính xác!");
        }

        User user = userOptional.get();

        // Tài khoản đăng ký qua Google/Facebook... thì không đăng nhập bằng mật khẩu ở đây
        if (!"LOCAL".equals(user.getAuthProvider())) {
            return ResponseEntity.badRequest()
                    .body("Tài khoản này được đăng ký qua " + user.getAuthProvider()
                            + ". Vui lòng đăng nhập bằng " + user.getAuthProvider() + ".");
        }

        if (user.getPassword() == null || user.getPassword().isEmpty()
                || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email hoặc mật khẩu không chính xác!");
        }

        if (!user.isVerified()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Tài khoản chưa được xác thực. Vui lòng kiểm tra email để nhập mã OTP.");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("tokenType", "Bearer");
        response.put("userId", user.getId());
        response.put("email", user.getEmail());
        response.put("fullName", user.getFullName());
        response.put("role", user.getRole());

        return ResponseEntity.ok(response);
    }

    // Endpoint mẫu để kiểm tra token: gửi kèm header "Authorization: Bearer <token>"
    @GetMapping("/me")
    public ResponseEntity<?> me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chưa đăng nhập!");
        }

        String email = (String) authentication.getPrincipal();
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Tài khoản không tồn tại!");
        }

        User user = userOptional.get();
        Map<String, Object> response = new HashMap<>();
        response.put("userId", user.getId());
        response.put("email", user.getEmail());
        response.put("fullName", user.getFullName());
        response.put("role", user.getRole());
        response.put("isVerified", user.isVerified());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/social-login")
    public ResponseEntity<?> socialLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String fullName = request.get("fullName");
        String provider = request.get("provider"); 
        String providerId = request.get("providerId"); 
        
        String role = request.containsKey("role") ? request.get("role") : "CANDIDATE"; 

        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;
        boolean isNewUser;

        if (existingUser.isPresent()) {
            user = existingUser.get();
            user.setAuthProvider(provider);
            user.setProviderId(providerId);
            userRepository.save(user);
            isNewUser = false;
        } else {
            user = User.builder()
                    .email(email)
                    .fullName(fullName)
                    .password("") 
                    .role(role)
                    .isVerified(true) 
                    .authProvider(provider)
                    .providerId(providerId)
                    .build();

            userRepository.save(user);
            isNewUser = true;
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("tokenType", "Bearer");
        response.put("userId", user.getId());
        response.put("email", user.getEmail());
        response.put("fullName", user.getFullName());
        response.put("role", user.getRole());
        response.put("message", isNewUser
                ? "Đăng ký bằng " + provider + " thành công!"
                : "Đăng nhập " + provider + " thành công!");

        return ResponseEntity.ok(response);
    }
}
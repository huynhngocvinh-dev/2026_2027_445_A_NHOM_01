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
        
        // --- ĐOẠN ĐÃ SỬA: Xử lý và chuẩn hóa phân quyền (Role) ---
        String rawRole = request.get("role");
        String role = "JOB_SEEKER"; // Đặt mặc định là Người tìm việc

        if (rawRole != null && !rawRole.trim().isEmpty()) {
            if (rawRole.equalsIgnoreCase("employer")) {
                role = "EMPLOYER";
            } else if (rawRole.equalsIgnoreCase("job_seeker")) {
                role = "JOB_SEEKER";
            } else {
                return ResponseEntity.badRequest().body("Lỗi: Quyền (role) không hợp lệ! Chỉ chấp nhận 'job_seeker' hoặc 'employer'.");
            }
        }
        // ---------------------------------------------------------

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
                .role(role) // Đã được chuẩn hóa thành IN HOA
                .isVerified(false)
                .otpCode(otp)
                .otpExpirationTime(LocalDateTime.now().plusMinutes(1)) 
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
        
        String rawProvider = request.get("provider");
        String provider = (rawProvider != null) ? rawProvider.toUpperCase() : "UNKNOWN"; 
        
        String providerId = request.get("providerId"); 
        
        String rawRole = request.get("role");
        String role = (rawRole != null && rawRole.equalsIgnoreCase("employer")) ? "EMPLOYER" : "JOB_SEEKER";

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
                    .role(role) // Đã được chuẩn hóa
                    .isVerified(true) 
                    .authProvider(provider)
                    .providerId(providerId)
                    .build();

            userRepository.save(newUser);
            return ResponseEntity.ok("Đăng ký bằng " + provider + " thành công!");
        }
    }
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Không tìm thấy tài khoản!");
        }

        User user = userOptional.get();

        // Nếu đã xác thực rồi thì không cho gửi OTP nữa
        if (user.isVerified()) {
            return ResponseEntity.badRequest().body("Tài khoản này đã được xác thực, không cần gửi lại mã!");
        }

        String newOtp = String.format("%06d", new Random().nextInt(999999));
        user.setOtpCode(newOtp);
        user.setOtpExpirationTime(LocalDateTime.now().plusMinutes(1)); 
        
        userRepository.save(user);

        // Bắn email OTP mới
        emailService.sendOtpEmail(email, newOtp);

        return ResponseEntity.ok("Đã gửi lại mã OTP mới. Mã có hiệu lực trong 1 phút.");
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Sai email hoặc mật khẩu!");
        }

        User user = userOptional.get();
        if (!user.isVerified()) {
            return ResponseEntity.badRequest().body("Lỗi: Tài khoản chưa được xác thực OTP. Vui lòng kiểm tra email hoặc đăng ký lại để nhận mã!");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest().body("Lỗi: Sai email hoặc mật khẩu!");
        }
        return ResponseEntity.ok("Đăng nhập thành công! Chào mừng " + user.getFullName());
    }
}
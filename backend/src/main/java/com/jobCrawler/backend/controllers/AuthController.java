package com.jobCrawler.backend.controllers;

import com.jobCrawler.backend.models.User;
import com.jobCrawler.backend.repositories.UserRepository;
import com.jobCrawler.backend.security.JwtUtil;
import com.jobCrawler.backend.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

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

    // VÙNG ĐỆM RAM: Lưu tạm người dùng chưa xác thực OTP
    private final Map<String, User> pendingUsers = new ConcurrentHashMap<>();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String fullName = request.get("fullName");
        String phoneNumber = request.get("phoneNumber"); // Có thể null hoặc rỗng
        String rawRole = request.get("role");

        // 1. Kiểm tra dữ liệu rỗng (ĐÃ BỎ KIỂM TRA PHONENUMBER)
        if (fullName == null || fullName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Họ và tên không được để trống!");
        }
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Email không được để trống!");
        }
        if (password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Mật khẩu không được để trống!");
        }
        if (rawRole == null || rawRole.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Vai trò tài khoản không được để trống!");
        }
        
        String emailRegex = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";
        if (!email.matches(emailRegex)) {
            return ResponseEntity.badRequest().body("Lỗi: Định dạng email không hợp lệ!");
        }

        // 2. Chuẩn hóa Role
        // 2. Chuẩn hóa Role
        String role = "JOB_SEEKER";
        if (rawRole.equalsIgnoreCase("employer") || rawRole.equalsIgnoreCase("EMPLOYER")) {
            role = "EMPLOYER";
        } else if (rawRole.equalsIgnoreCase("job_seeker") || rawRole.equalsIgnoreCase("JOB_SEEKER") || rawRole.equalsIgnoreCase("CANDIDATE")) {
            role = "JOB_SEEKER";
        } else {
            return ResponseEntity.badRequest().body("Lỗi: Quyền (role) không hợp lệ!");
        }

        // 3. Kiểm tra độ mạnh mật khẩu
        String passwordRegex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$";
        if (!password.matches(passwordRegex)) {
            return ResponseEntity.badRequest().body("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
        }

        // 4. Kiểm tra Email trong DB
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Lỗi: Email này đã được sử dụng!");
        }

        // 5. Tạo OTP và đóng gói User tạm
        String otp = String.format("%06d", new Random().nextInt(999999));
        User pendingUser = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .fullName(fullName)
                .phoneNumber(phoneNumber) // nhận null hoặc rỗng bình thường
                .role(role)
                .isVerified(false)
                .otpCode(otp)
                .otpExpirationTime(LocalDateTime.now().plusHours(1))
                .authProvider("LOCAL")
                .build();

        // 6. Lưu tạm vào RAM
        pendingUsers.put(email, pendingUser);

        // 7. Gửi Mail OTP
        try {
            emailService.sendOtpEmail(email, otp);
        } catch (Exception e) {
            pendingUsers.remove(email);
            return ResponseEntity.badRequest().body("Lỗi: Không thể gửi mã OTP tới email này. Vui lòng kiểm tra lại địa chỉ email!");
        }

        return ResponseEntity.ok("Đăng ký thành công! Vui lòng kiểm tra email để nhận mã OTP.");
    }
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otpCode = request.get("otpCode");

        User pendingUser = pendingUsers.get(email);
        
        if (pendingUser == null) {
            return ResponseEntity.badRequest().body("Không tìm thấy yêu cầu đăng ký hoặc phiên đã hết hạn!");
        }

        if (!pendingUser.getOtpCode().equals(otpCode)) {
            return ResponseEntity.badRequest().body("Mã OTP không chính xác!");
        }
        
        if (pendingUser.getOtpExpirationTime().isBefore(LocalDateTime.now())) {
            pendingUsers.remove(email); 
            return ResponseEntity.badRequest().body("Mã OTP đã hết hạn! Vui lòng đăng ký lại.");
        }

        // OTP hợp lệ -> Lưu vào DB chính thức (Đã sửa setVerified)
        pendingUser.setIsVerified(true);
        pendingUser.setOtpCode(null);
        pendingUser.setOtpExpirationTime(null);
        userRepository.save(pendingUser);

        // Clear RAM
        pendingUsers.remove(email);

        return ResponseEntity.ok("Xác thực tài khoản thành công!");
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Tài khoản này đã được xác thực, không cần gửi lại mã!");
        }

        User pendingUser = pendingUsers.get(email);
        if (pendingUser == null) {
            return ResponseEntity.badRequest().body("Không tìm thấy yêu cầu đăng ký, vui lòng đăng ký lại!");
        }

        String newOtp = String.format("%06d", new Random().nextInt(999999));
        pendingUser.setOtpCode(newOtp);
        pendingUser.setOtpExpirationTime(LocalDateTime.now().plusMinutes(5));
        pendingUsers.put(email, pendingUser); 
        
        try {
            emailService.sendOtpEmail(email, newOtp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: Không thể gửi lại mã OTP. Vui lòng thử lại sau!");
        }

        return ResponseEntity.ok("Đã gửi lại mã OTP mới. Vui lòng kiểm tra hòm thư!");
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

    // Tự động xóa rác trên RAM mỗi 15 phút 
    @Scheduled(fixedRate = 900000)
    public void cleanupExpiredPendingUsers() {
        LocalDateTime now = LocalDateTime.now();
        pendingUsers.entrySet().removeIf(entry -> 
            entry.getValue().getOtpExpirationTime() != null &&
            entry.getValue().getOtpExpirationTime().isBefore(now)
        );        
    }
}
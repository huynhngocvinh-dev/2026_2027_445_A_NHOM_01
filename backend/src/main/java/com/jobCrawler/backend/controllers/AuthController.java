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

    // VÙNG ĐỆM RAM: Lưu tạm người dùng chưa xác thực
    private final Map<String, User> pendingUsers = new ConcurrentHashMap<>();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String fullName = request.get("fullName");
        String phoneNumber = request.get("phoneNumber");
        String rawRole = request.get("role");

        // 1. CHỐT CHẶN DỮ LIỆU RỖNG: Không cho phép thiếu bất kỳ trường nào
        if (fullName == null || fullName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Họ và tên không được để trống!");
        }
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Email không được để trống!");
        }
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Số điện thoại không được để trống!");
        }
        if (password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Mật khẩu không được để trống!");
        }
        if (rawRole == null || rawRole.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Vai trò tài khoản không được để trống!");
        }
        String emailRegex = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";
        if (email == null || !email.matches(emailRegex)) {
        return ResponseEntity.badRequest().body("Lỗi: Định dạng email không hợp lệ!");
        }

        // 2. Chuẩn hóa và kiểm tra Quyền (Role)
        String role = "JOB_SEEKER";
        if (rawRole.equalsIgnoreCase("employer")) {
            role = "EMPLOYER";
        } else if (rawRole.equalsIgnoreCase("job_seeker")) {
            role = "JOB_SEEKER";
        } else {
            return ResponseEntity.badRequest().body("Lỗi: Quyền (role) không hợp lệ!");
        }

        // 3. Kiểm tra định dạng mật khẩu bằng Regex
        String passwordRegex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$";
        if (!password.matches(passwordRegex)) {
            return ResponseEntity.badRequest().body("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
        }

        // 4. Kiểm tra trong Database thật
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Lỗi: Email này đã được sử dụng!");
        }

        // 5. Tạo mã OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // 6. Đóng gói User (Lưu ý: Biến passwordEncoder phải được khai báo @Autowired trong Controller)
        User pendingUser = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password)) 
                .fullName(fullName)
                .phoneNumber(phoneNumber)
                .role(role) 
                .isVerified(false)
                .otpCode(otp)
                .otpExpirationTime(LocalDateTime.now().plusHours(1)) 
                .authProvider("LOCAL") 
                .build();

       // 7. Lưu tạm vào bộ nhớ RAM
        pendingUsers.put(email, pendingUser);

        // 8. Bắn email OTP (Đã được bọc try-catch để chặn đứng nếu gửi mail lỗi)
        try {
            emailService.sendOtpEmail(email, otp);
        } catch (Exception e) {
            // Xóa ngay user khỏi bộ nhớ tạm vì gửi mail không thành công
            pendingUsers.remove(email);

            // Báo lỗi ngược lại cho người dùng
            return ResponseEntity.badRequest().body("Lỗi: Không thể gửi mã OTP tới email này. Vui lòng kiểm tra lại địa chỉ email!");
        }

        return ResponseEntity.ok("Đăng ký thành công! Vui lòng kiểm tra email để nhận mã OTP.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otpCode = request.get("otpCode");

        // 1. Tìm trong vùng đệm RAM thay vì Database
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

        // 2. OTP Hợp lệ -> Chính thức lưu vào CSDL
        pendingUser.setIsVerified(true);
        pendingUser.setOtpCode(null); 
        pendingUser.setOtpExpirationTime(null);
        userRepository.save(pendingUser);

        // 3. Xóa dữ liệu tạm
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
        pendingUser.setOtpExpirationTime(LocalDateTime.now().plusMinutes(1));        
        pendingUsers.put(email, pendingUser); 
        emailService.sendOtpEmail(email, newOtp);

        return ResponseEntity.ok("Đã gửi lại mã OTP mới. Mã có hiệu lực trong 1 phút.");
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
                    .role(role) 
                    .isVerified(true) 
                    .authProvider(provider)
                    .providerId(providerId)
                    .build();

            userRepository.save(newUser);
            return ResponseEntity.ok("Đăng ký bằng " + provider + " thành công!");
        }
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
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest().body("Lỗi: Sai email hoặc mật khẩu!");
        }
        
        return ResponseEntity.ok("Đăng nhập thành công! Chào mừng " + user.getFullName());
    }
    // Hàm tự động quét và xóa rác trên RAM mỗi 15 phút (900,000 ms)
    @org.springframework.scheduling.annotation.Scheduled(fixedRate = 900000)
    public void cleanupExpiredPendingUsers() {
        LocalDateTime now = LocalDateTime.now();
        
        // Duyệt qua biến RAM, nếu ai hết hạn OTP thì tự động gỡ bỏ khỏi bộ nhớ
        pendingUsers.entrySet().removeIf(entry -> 
            entry.getValue().getOtpExpirationTime().isBefore(now)
        );        
    }
}
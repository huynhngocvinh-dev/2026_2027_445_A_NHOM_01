package com.jobCrawler.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;
    private String fullName;
    private String phoneNumber;
    private String role;

    // Đổi sang Boolean (chữ B hoa) để Lombok tạo setIsVerified() và isVerified()
    @Builder.Default
    private Boolean isVerified = false;

    private String otpCode;
    private LocalDateTime otpExpirationTime;

    private String authProvider;
    private String providerId;

    // Getter chuẩn cho Lombok
    public Boolean isVerified() {
        return isVerified != null && isVerified;
    }
}
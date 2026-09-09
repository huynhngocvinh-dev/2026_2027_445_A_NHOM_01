package com.jobCrawler.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
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
    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "role")
    private String role;

    // --- Các trường OTP ---
    @Column(name = "is_verified")
    private boolean isVerified = false;
    
    @Column(name = "otp_code")
    private String otpCode;
    
    @Column(name = "otp_expiration_time")
    private LocalDateTime otpExpirationTime;

    // --- Các trường Social Login ---
    @Column(name = "auth_provider")
    private String authProvider;

    @Column(name = "provider_id")
    private String providerId;
}
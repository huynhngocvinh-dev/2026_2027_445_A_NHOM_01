package com.jobCrawler.backend.config;

import com.jobCrawler.backend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // 1. Cho phép Public Auth & Error
                .requestMatchers("/api/auth/**", "/error").permitAll()
                
                // 2. Cho phép Bot Node.js và Trang Duyệt Tin / Crawl gọi API không cần Token
                .requestMatchers("/api/admin/approval/**", "/api/admin/crawl/**").permitAll()
                
                // 3. Cho phép xem danh sách việc làm công khai & API công ty
                .requestMatchers(HttpMethod.GET, "/api/jobs/**", "/api/search/**").permitAll()
                
                // ===== BỔ SUNG: Cho phép HR xem và cập nhật thông tin công ty =====
                // (Nếu đã dùng JWT Auth hoàn chỉnh, đổi .permitAll() thành .authenticated() hoặc .hasRole("HR"))
                .requestMatchers("/api/v1/company/**").permitAll() 
                
                // 4. Các quyền yêu cầu đăng nhập / role
                .requestMatchers("/api/jobs/hr/**", "/api/jobs/crawler/**").permitAll()
                .requestMatchers("/api/users/**").hasRole("ADMIN")
                .requestMatchers("/api/saved-jobs/**", "/api/search/history/**").authenticated()
                
                // 5. Tất cả request còn lại bắt buộc authenticate
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Bổ sung các port phổ biến của Vite React (5173, 5174, 5175) & NextJS/React (3000)
        configuration.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://localhost:3000"
        ));
        
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        
        // ===== BỔ SUNG: Cho phép truyền tất cả Headers bao gồm X-HR-User-Id =====
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-HR-User-Id", "X-Requested-With", "Accept"));
        configuration.setExposedHeaders(List.of("Authorization", "X-HR-User-Id"));
        
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
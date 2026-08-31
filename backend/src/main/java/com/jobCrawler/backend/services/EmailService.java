package com.jobCrawler.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        
        message.setFrom(fromEmail); 
        
        message.setTo(toEmail.trim()); 
        
        message.setSubject("Mã xác nhận đăng ký tài khoản - JobFinder");
        message.setText("Chào bạn,\n\n" +
                        "Mã xác nhận (OTP) để kích hoạt tài khoản của bạn là: " + otpCode + "\n\n" +
                        "Mã này có hiệu lực trong vòng 5 phút. Vui lòng không chia sẻ cho bất kỳ ai.\n\n" +
                        "Trân trọng, \nĐội ngũ JobFinder.");
        
        mailSender.send(message);
    }
}
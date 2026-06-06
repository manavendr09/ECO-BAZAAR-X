package com.ecobazaar.backend.service;

// NOTE: To use this service, add the following dependency to your pom.xml:
// <dependency>
//     <groupId>org.springframework.boot</groupId>
//     <artifactId>spring-boot-starter-mail</artifactId>
// </dependency>

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("EcoBazaarX - Password Reset OTP");
        message.setText(
            "Your OTP for password reset is: " + otp + "\n\n" +
            "This OTP is valid for 10 minutes.\n" +
            "If you did not request this, please ignore this email."
        );

        mailSender.send(message);
    }
}

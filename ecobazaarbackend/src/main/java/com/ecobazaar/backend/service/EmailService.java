package com.ecobazaar.backend.service;

import com.ecobazaar.backend.entity.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // ── OTP Email ────────────────────────────────────────────────────
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

    // ── Order Confirmation Email ──────────────────────────────────────
    public void sendOrderConfirmationEmail(Order order) {
        try {
            String customerEmail = order.getUser().getEmail();
            if (customerEmail == null || customerEmail.isBlank()) return;

            String name = order.getUser().getFirstName() + " " + order.getUser().getLastName();

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(customerEmail);
            message.setSubject("EcoBazaarX - Order Confirmed! #" + order.getId());
            message.setText(
                "Hi " + name + ",\n\n" +
                "Your order #" + order.getId() + " has been placed successfully!\n\n" +
                "Order Total: Rs." + order.getTotalPrice() + "\n" +
                "Status: " + order.getStatus() + "\n" +
                "Shipping Address: " + order.getShippingAddress() + "\n\n" +
                "Thank you for shopping eco-friendly!\n\n" +
                "Team EcoBazaarX"
            );
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Could not send order confirmation email: " + e.getMessage());
        }
    }

    // ── Shipping Notification Email ───────────────────────────────────
    public void sendShippingNotificationEmail(Order order) {
        try {
            String customerEmail = order.getUser().getEmail();
            if (customerEmail == null || customerEmail.isBlank()) return;

            String name = order.getUser().getFirstName() + " " + order.getUser().getLastName();

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(customerEmail);
            message.setSubject("EcoBazaarX - Order Shipped! #" + order.getId());
            message.setText(
                "Hi " + name + ",\n\n" +
                "Great news! Your order #" + order.getId() + " has been shipped.\n\n" +
                "Tracking Number: " + order.getTrackingNumber() + "\n\n" +
                "Thank you for shopping eco-friendly!\n\n" +
                "Team EcoBazaarX"
            );
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Could not send shipping notification email: " + e.getMessage());
        }
    }
}

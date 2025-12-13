package com.ecobazaarx.smart_cart_backend.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.ecobazaarx.smart_cart_backend.entity.Order;
import com.ecobazaarx.smart_cart_backend.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true = HTML
            helper.setFrom("yourEmail@gmail.com");
            mailSender.send(msg);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
//    public void sendOrderConfirmation(String to, Order order) {
//        String subject = "Order Confirmation - EcoBazaarX";
//        String msg = "Your order " + order.getId() + " is confirmed.";
//
//        sendEmail(to, subject, msg);
//    }
//    public void sendOrderConfirmation(String to, Order order) {
//
//        String subject = "Your EcoBazaarX Order #" + order.getId() + " is Confirmed!";
//
//        String msg =
//                "Hello,\n\n" +
//                "Thank you for shopping with EcoBazaarX! 🌿\n\n" +
//                "We’re happy to let you know that your order **#" + order.getId() + "** has been successfully confirmed.\n\n" +
//                "🛒 **Order Details:**\n" +
//                "------------------------------------\n" +
//                "Order ID: " + order.getId() + "\n" +
//                "Payment Status: " + order.getPaymentStatus() + "\n" +
//                "Ordered On: " + order.getOrderDate() + "\n" +
//                "------------------------------------\n\n" +
//                "📦 Your items are being prepared and will be shipped soon.\n" +
//                "You will receive another update once your order is dispatched.\n\n" +
//                "If you have any questions, feel free to contact our support team.\n\n" +
//                "Thank you for choosing EcoBazaarX — where sustainability meets shopping! 🌱\n\n" +
//                "Warm regards,\n" +
//                "EcoBazaarX Team";
//
//        sendEmail(to, subject, msg);
//    }
//    public void sendOrderConfirmation(String to, Order order) {
//
//        String subject = "Your EcoBazaarX Order #" + order.getId() + " is Confirmed!";
//
//        String html =
//                "<!DOCTYPE html>" +
//                "<html>" +
//                "<body style='font-family: Arial, sans-serif; background-color:#f4f4f4; padding:20px;'>" +
//
//                "<div style='max-width:600px; margin:auto; background:white; padding:20px; border-radius:8px; box-shadow:0 0 10px rgba(0,0,0,0.1);'>" +
//
//                "<h2 style='color:#2ecc71; text-align:center;'>EcoBazaarX 🌿</h2>" +
//
//                "<h3 style='color:#333;'>Your Order is Confirmed!</h3>" +
//                "<p>Hi there,</p>" +
//                "<p>Thank you for shopping with <b>EcoBazaarX</b>! We’re excited to let you know that your order has been successfully confirmed.</p>" +
//
//                "<div style='background:#fafafa; padding:15px; border-radius:5px; border:1px solid #e6e6e6;'>" +
//                "<h4 style='margin-top:0;'>🧾 Order Summary</h4>" +
//                "<p><b>Order ID:</b> " + order.getId() + "</p>" +
//                "<p><b>Order Date:</b> " + order.getOrderDate() + "</p>" +
//                "<p><b>Total Amount:</b> ₹" + order.getTotalAmount() + "</p>" +
//                "<p><b>Payment Status:</b> " + order.getPaymentStatus() + "</p>" +
//                "</div>" +
//
//                "<p style='margin-top:20px;'>📦 Your order is now being prepared. We will notify you once it is shipped.</p>" +
//
//                "<p>If you have any questions, feel free to reach out to our customer support.</p>" +
//
//                "<hr style='border:none; border-top:1px solid #eee; margin:20px 0;'>" +
//
//                "<p style='text-align:center; color:#777;'>Thank you for choosing <b>EcoBazaarX</b> — Bringing Sustainability Closer to You 🌱</p>" +
//
//                "</div>" +
//                "</body>" +
//                "</html>";
//
//        sendEmail(to, subject, html);
//    }
    public void sendOrderConfirmation(String to, Order order) {
        String subject = "Your Order is Confirmed! 🎉 – EcoBazaarX";

        String msg = "Hello " + order.getCustomerName() + ",\n\n"
                + "Thank you for shopping with *EcoBazaarX*! We’re excited to let you know that your order has been "
                + "successfully confirmed and is now being prepared with utmost care. 😊\n\n"

                + "-------------------------------\n"
                + "🧾 ORDER SUMMARY\n"
                + "-------------------------------\n"
                + "📌 Order ID: " + order.getId() + "\n"
                + "📅 Order Date: " + order.getOrderDate() + "\n"
                + "💳 Payment Status: " + order.getPaymentStatus() + "\n"
                + "Total Amount: ₹" + order.getTotalPrice() + "\n"   // <-- Here
                + "🚚 Delivery Address: " + order.getShippingAddress() + "\n\n"

                + "-------------------------------\n"
                + "📦 WHAT HAPPENS NEXT?\n"
                + "-------------------------------\n"
                + "• Your order is being packed carefully.\n"
                + "• You will receive live updates as your order moves through each stage.\n"
                + "• Once shipped, you’ll get a tracking link to follow your package in real time.\n\n"

                + "-------------------------------\n"
                + "⭐ EXCLUSIVE CUSTOMER BENEFITS\n"
                + "-------------------------------\n"
                + "• 24/7 Customer Support\n"
                + "• Easy 7-Day Return Policy\n"
                + "• Fast & Secure Delivery\n"
                + "• Priority Support for Registered Users\n\n"

                + "If you need any help, simply reply to this email — our support team is always ready to assist you.\n\n"
                + "Thank you for choosing EcoBazaarX.\n"
                + "We hope you enjoy your purchase! 🌿\n\n"
                + "Warm Regards,\n"
                + "EcoBazaarX Team";

        sendEmail(to, subject, msg);
    }

    
}

package com.ecobazaarx.smart_cart_backend.service;

import com.ecobazaarx.smart_cart_backend.entity.Order;

public interface EmailService {
    void sendEmail(String to, String subject, String body);

	void sendOrderConfirmation(String email, Order saved);
    
}

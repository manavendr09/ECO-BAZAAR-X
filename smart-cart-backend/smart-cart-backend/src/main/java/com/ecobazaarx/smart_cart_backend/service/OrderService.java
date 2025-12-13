package com.ecobazaarx.smart_cart_backend.service;

import org.springframework.stereotype.Service;
import com.ecobazaarx.smart_cart_backend.entity.Order;
import com.ecobazaarx.smart_cart_backend.entity.User;
import com.ecobazaarx.smart_cart_backend.repository.OrderRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final EmailService emailService;

    public OrderService(OrderRepository orderRepository, CartService cartService, EmailService emailService) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.emailService = emailService;
    }

    // PLACE ORDER
    public Order placeOrder(User user, String paymentMethod) {

        Order order = new Order();

        order.setUser(user);
        order.setItems(cartService.getCartItems(user.getId()));
        order.setTotalPrice(cartService.getTotalPrice(user.getId()).doubleValue());
        order.setTotalEmission(cartService.getTotalEmission(user.getId()));
        order.setOrderDate(LocalDateTime.now());

        order.setPaymentMethod(paymentMethod);

        // PAYMENT STATUS LOGIC
        if (paymentMethod.equalsIgnoreCase("COD")) {
            order.setPaymentStatus("PENDING");
        } else {
            order.setPaymentStatus("PAID");
            order.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8));
        }

        // TRACKING ID
        order.setOrderTrackingId("TRK-" + System.currentTimeMillis());

        // ORDER STATUS
        order.setStatus("CONFIRMED");

        // SAVE ORDER
        Order saved = orderRepository.save(order);

        // CLEAR CART
        cartService.clearCart(user.getId());

        // EMAIL NOTIFICATION
        emailService.sendOrderConfirmation(user.getEmail(), saved);

        return saved;
    }

    // GET ORDERS BY USER
    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUser(user);
    }
}
